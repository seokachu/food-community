"use client";

import { useEffect, useRef, useState } from "react";

import { Icon } from "@/components/foundation/Icon";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/cn";

/** 지도에서 쓰는 좌표. SDK 의 LatLng 클래스와 달리 직렬화 가능한 값 객체다. */
export interface MapCoord {
  lat: number;
  lng: number;
}

/** 아무것도 선택하지 않았을 때의 기본 중심 — 서울시청. */
export const SEOUL_CITY_HALL: MapCoord = { lat: 37.5666103, lng: 126.9783882 };

/**
 * 좌표가 사실상 같은 위치인지. panTo 왕복이나 픽셀 스냅에서 생기는
 * 미세한 오차(±1e-5도 ≈ 1m)는 같은 위치로 본다.
 */
export function isSameCoord(a: MapCoord, b: MapCoord): boolean {
  return Math.abs(a.lat - b.lat) < 1e-5 && Math.abs(a.lng - b.lng) < 1e-5;
}

const SDK_URL = "https://oapi.map.naver.com/openapi/v3/maps.js";

let sdkLoading: Promise<void> | null = null;

/** SDK 스크립트를 문서에 한 번만 붙인다. 실패하면 다음 마운트에서 다시 시도한다. */
function loadSdk(clientId: string): Promise<void> {
  if (window.naver?.maps) return Promise.resolve();
  sdkLoading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${SDK_URL}?ncpKeyId=${encodeURIComponent(clientId)}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      script.remove();
      sdkLoading = null;
      reject(new Error("네이버 지도 SDK 로드에 실패했습니다"));
    };
    document.head.append(script);
  });
  return sdkLoading;
}

export interface NaverMapProps {
  /** NCP Maps 클라이언트 키. 없으면 로드를 시도하지 않고 안내 문구를 보여준다. */
  clientId: string;
  /** 지도 중심. 바뀌면 그 위치로 부드럽게 이동한다. 기본값은 서울시청. */
  center?: MapCoord;
  zoom?: number;
  /**
   * 지도 중심에 고정된 핀. 지도가 움직여도 핀은 화면 가운데 그대로라
   * 사용자는 지도를 끌어서 핀 아래에 원하는 위치를 맞춘다.
   */
  centerPin?: boolean;
  /**
   * 좌표에 고정된 SDK 마커. 중심 핀과 달리 지도를 움직여도 그 자리에 남아
   * 저장된 장소 위치를 보여주는 조회용 지도가 쓴다.
   */
  marker?: MapCoord;
  /**
   * false 면 드래그·줌을 끈 조회 전용 지도가 된다. 폼 미리보기처럼 스크롤을
   * 가로채면 안 되는 자리에 쓴다. 지도 생성 시점에만 반영된다.
   */
  interactive?: boolean;
  /**
   * 지도 이동이 멈출 때(idle)마다 중심 좌표를 알려준다.
   * 핀 고정 방식에선 이 값이 곧 사용자가 핀으로 고른 위치다.
   */
  onCenterChange?: (center: MapCoord) => void;
  /** 높이·라운드는 호출측이 정한다. MapPreview 와 같은 규약이다. */
  className?: string;
}

/**
 * 네이버 지도 SDK 를 감싼 실제 지도. MapPreview(자리표시자)의 실지도 버전이다.
 * 키가 없거나 로드에 실패하면 MapPreview empty 와 같은 문법의 폴백을 보여준다.
 */
export function NaverMap({
  clientId,
  center = SEOUL_CITY_HALL,
  zoom = 15,
  centerPin = true,
  marker,
  interactive = true,
  onCenterChange,
  className,
}: NaverMapProps) {
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markerRef = useRef<naver.maps.Marker | null>(null);
  const [sdkStatus, setSdkStatus] = useState<"loading" | "ready" | "error">("loading");
  // 키가 없으면 로드를 시도하지 않으므로 상태 저장 없이 바로 에러로 친다.
  const status = clientId ? sdkStatus : "error";
  // 지도 생성 시점의 시야·조작 여부. 이후의 center 변경은 panTo 로 따라간다.
  const initialViewRef = useRef({ center, zoom, interactive });
  // idle 리스너는 지도와 함께 한 번만 등록하므로 최신 콜백은 ref 로 전달한다.
  const onCenterChangeRef = useRef(onCenterChange);
  useEffect(() => {
    onCenterChangeRef.current = onCenterChange;
  }, [onCenterChange]);

  useEffect(() => {
    if (!clientId) return;
    let cancelled = false;
    // 잘못된 키면 스크립트는 로드되지만 SDK 가 이 전역 훅을 부른다.
    window.navermap_authFailure = () => {
      if (!cancelled) setSdkStatus("error");
    };
    loadSdk(clientId).then(
      () => {
        if (cancelled || !mapElRef.current || !window.naver) return;
        const { center: c, zoom: z, interactive: canMove } = initialViewRef.current;
        const map = new window.naver.maps.Map(mapElRef.current, {
          center: new window.naver.maps.LatLng(c.lat, c.lng),
          zoom: z,
          // 조회 전용이면 모든 이동·줌 입력을 지도 생성 시점에 막는다.
          draggable: canMove,
          pinchZoom: canMove,
          scrollWheel: canMove,
          keyboardShortcuts: canMove,
          disableDoubleClickZoom: !canMove,
          disableDoubleTapZoom: !canMove,
          disableTwoFingerTapZoom: !canMove,
        });
        // 드래그·줌·panTo 가 끝나 지도가 멈출 때마다 중심(=핀 위치)을 알린다.
        window.naver.maps.Event.addListener(map, "idle", () => {
          const at = map.getCenter();
          onCenterChangeRef.current?.({ lat: at.lat(), lng: at.lng() });
        });
        mapRef.current = map;
        setSdkStatus("ready");
      },
      () => {
        if (!cancelled) setSdkStatus("error");
      },
    );
    return () => {
      cancelled = true;
      delete window.navermap_authFailure;
      mapRef.current?.destroy();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [clientId]);

  // 마커는 지도와 별개로 갱신한다. 좌표가 빠지면 지도에서 떼어낸다.
  const markerLat = marker?.lat;
  const markerLng = marker?.lng;
  useEffect(() => {
    if (status !== "ready" || !mapRef.current || !window.naver) return;
    if (markerLat === undefined || markerLng === undefined) {
      markerRef.current?.setMap(null);
      markerRef.current = null;
      return;
    }
    const position = new window.naver.maps.LatLng(markerLat, markerLng);
    if (markerRef.current) {
      markerRef.current.setPosition(position);
    } else {
      markerRef.current = new window.naver.maps.Marker({
        position,
        map: mapRef.current,
      });
    }
  }, [status, markerLat, markerLng]);

  useEffect(() => {
    if (status !== "ready" || !mapRef.current || !window.naver) return;
    // 지도에서 시작된 이동이 center 프롭으로 되돌아온 경우엔 다시 움직이지 않는다.
    const at = mapRef.current.getCenter();
    if (isSameCoord({ lat: at.lat(), lng: at.lng() }, { lat: center.lat, lng: center.lng }))
      return;
    mapRef.current.panTo(new window.naver.maps.LatLng(center.lat, center.lng));
  }, [status, center.lat, center.lng]);

  return (
    <div
      role="application"
      aria-label="네이버 지도"
      className={cn("bg-background-subtle relative isolate overflow-hidden", className)}
    >
      {/* SDK 가 인라인으로 position:relative 를 덮어쓰므로 absolute 대신 크기로 채운다. */}
      <div ref={mapElRef} className="absolute inset-0 size-full" />

      {/* 핀 기둥의 아래 끝이 정확히 지도 중심에 닿는다. 장식이라 aria 에서 감춘다. */}
      {status === "ready" && centerPin && (
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-full flex-col items-center"
        >
          <span className="bg-background-brand flex size-12 items-center justify-center rounded-full shadow-[0_4px_8px_0_var(--color-shadow-strong)]">
            <Icon name="map-pin" size={24} className="text-icon-on-brand" />
          </span>
          <span className="bg-background-brand -mt-0.5 h-3 w-1.5 rounded-b-full" />
        </span>
      )}

      {status === "loading" && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner label="지도를 불러오는 중" />
        </span>
      )}

      {status === "error" && (
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
          {/* MapPreview empty 와 같은 42px 원형 배경. */}
          <span className="bg-background-neutral-soft flex size-10.5 items-center justify-center rounded-full">
            <Icon name="map-pin" size={24} className="text-icon-muted" />
          </span>
          <p className="text-label-md text-text-muted text-center">
            {clientId
              ? "지도를 불러오지 못했어요"
              : "지도 키(NAVER_MAP_CLIENT_ID)가 설정되지 않았어요"}
          </p>
        </span>
      )}
    </div>
  );
}
