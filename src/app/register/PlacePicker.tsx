"use client";

import { useCallback, useRef, useState, type FormEvent } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { Container, NarrowColumn } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardDescription, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconButton } from "@/components/ui/IconButton";
import {
  isSameCoord,
  NaverMap,
  SEOUL_CITY_HALL,
  type MapCoord,
} from "@/components/ui/NaverMap";
import { TextField } from "@/components/ui/TextField";
import { Toast } from "@/components/ui/Toast";
import { TopNavigation } from "@/components/ui/TopNavigation";
import { searchPlaces, type PlaceSearchResult } from "@/lib/place-search";
import { reverseGeocode } from "@/lib/reverse-geocode";

/** 지도 이동으로 조회한 핀(중심) 위치의 지번주소 상태. */
type PinAddress =
  | { status: "loading" }
  | { status: "done"; address: string | null }
  | { status: "error" };

/** 고르는 도중의 선택 상태. 직접 입력 직후에는 주소·좌표가 아직 없다. */
export interface SelectedPlace {
  name: string;
  address: string | null;
  /** 검색 결과 좌표 또는 지도 핀 좌표. 다시 열었을 때 지도 중심 복원에도 쓴다. */
  position?: MapCoord;
}

/**
 * 등록 폼에 돌려주는 확정 결과. 지도 정보는 필수라 장소명·지번주소·좌표가
 * 모두 채워져야만 확정할 수 있다(BFF 도 같은 기준으로 막는다).
 */
export interface ConfirmedPlace {
  name: string;
  address: string;
  position: MapCoord;
}

/**
 * 등록 폼의 `장소 입력하기` 가 여는 전체 화면 단계.
 * design.pen 세 시안을 상태로 오간다.
 *
 * - `map`: 검색 필드 + 네이버 지도. 핀은 지도 중심에 고정되어 있고 지도를
 *   움직여 위치를 맞춘다. 기본 중심은 서울시청, 검색 결과를 고르면 선택한
 *   장소명이 검색창에, 지번주소가 주소 카드에 들어가고 지도는 그 좌표로
 *   이동한다. 지도를 직접 움직이면 멈춘 중심 좌표를 리버스 지오코딩
 *   (BFF `/api/reverse-geocode`)해 주소 카드를 핀 위치의 지번주소로 갱신하고,
 *   선택된 장소의 좌표·주소도 그 값으로 바뀐다. 장소가 정해지면 확인 버튼이 붙는다.
 * - `results`: 네이버 지역검색(BFF `/api/place-search`) 결과 목록.
 *   0건이면 결과 없음 + 직접 입력 폼을 그대로 편다.
 * - `direct`: 장소명만 직접 받는 화면. 등록하면 map 으로 돌아가고, 지도를
 *   움직여 주소·좌표를 채워야 확정(이 위치로 등록하기)할 수 있다.
 *
 * 별도 라우트로 빼지 않는 이유: 등록 폼의 첨부 파일 상태는 페이지를 떠나면
 * 복원할 수 없다. 폼과 같은 페이지 안에서 화면만 통째로 바꾼다.
 */
export function PlacePicker({
  naverMapClientId,
  initialPlace,
  backLabel = "맛집 등록으로",
  onConfirm,
  onBack,
}: {
  naverMapClientId: string;
  initialPlace: ConfirmedPlace | null;
  /** 데스크톱 되돌아가기 문구. 수정 폼에서 열면 "맛집 수정으로"를 넘긴다. */
  backLabel?: string;
  onConfirm: (place: ConfirmedPlace) => void;
  onBack: () => void;
}) {
  const [mode, setMode] = useState<"map" | "results" | "direct">("map");
  // 검색창은 마지막으로 정해진 장소명을 그대로 보여준다. 다시 열어도 복원된다.
  const [query, setQuery] = useState(initialPlace?.name ?? "");
  const [results, setResults] = useState<PlaceSearchResult[]>([]);
  const [selected, setSelected] = useState<SelectedPlace | null>(initialPlace);
  const [directName, setDirectName] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  // null 이면 아직 지도를 움직이지 않아 선택한 장소의 주소를 그대로 보여준다.
  const [pinAddress, setPinAddress] = useState<PinAddress | null>(null);
  // 마지막으로 처리한 지도 중심. panTo(선택·복원)가 돌려주는 idle 을 걸러낸다.
  const lastCenterRef = useRef<MapCoord>(initialPlace?.position ?? SEOUL_CITY_HALL);
  // 지도를 연달아 움직였을 때 늦게 도착한 이전 응답을 버리기 위한 순번.
  const geocodeSeqRef = useRef(0);

  /** 지도가 프로그램적으로 이동할 때(선택·직접 입력) 핀 기준점을 맞추고 조회 상태를 비운다. */
  const resetPin = (position?: MapCoord) => {
    lastCenterRef.current = position ?? SEOUL_CITY_HALL;
    geocodeSeqRef.current += 1;
    setPinAddress(null);
  };

  /** 지도가 멈추면 핀(중심) 위치를 리버스 지오코딩해 주소 카드·선택 좌표에 반영한다. */
  const handleCenterChange = useCallback((center: MapCoord) => {
    // 검색 선택·초기 진입의 panTo 가 부른 idle 은 무시하고, 사용자가 끈 이동만 처리한다.
    if (isSameCoord(center, lastCenterRef.current)) return;
    lastCenterRef.current = center;
    const seq = ++geocodeSeqRef.current;
    setPinAddress({ status: "loading" });
    // 핀이 곧 위치다. 주소 조회 결과와 무관하게 좌표는 바로 옮기고 옛 주소는 지운다.
    setSelected((prev) => (prev ? { ...prev, position: center, address: null } : prev));
    reverseGeocode(center).then(
      (address) => {
        if (seq !== geocodeSeqRef.current) return;
        setPinAddress({ status: "done", address });
        setSelected((prev) => (prev ? { ...prev, address } : prev));
      },
      () => {
        if (seq !== geocodeSeqRef.current) return;
        setPinAddress({ status: "error" });
      },
    );
  }, []);

  // 지도 정보가 모두 채워졌을 때만 확정할 수 있다. BFF 도 같은 기준으로 막는다.
  const confirmed: ConfirmedPlace | null =
    selected && selected.address && selected.position
      ? {
          name: selected.name,
          address: selected.address,
          position: selected.position,
        }
      : null;

  // 주소 카드 본문. 지도를 움직인 뒤에는 항상 핀 위치의 조회 상태를 보여준다.
  const addressLine =
    pinAddress === null
      ? (selected?.address ?? "지도를 움직여 핀으로 위치를 지정해주세요")
      : pinAddress.status === "loading"
        ? "핀 위치의 주소를 확인하는 중…"
        : pinAddress.status === "error"
          ? "주소를 확인하지 못했어요. 지도를 다시 움직여주세요"
          : (pinAddress.address ?? "주소를 찾을 수 없는 위치예요. 지도를 다시 움직여주세요");

  const searchHint = searching
    ? "네이버 지역검색 중…"
    : mode === "map"
      ? "검색 후 지도에서 위치를 확인해주세요"
      : results.length > 0
        ? "네이버 장소 검색 결과를 불러왔어요"
        : "검색 결과가 없어요";

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.trim();
    if (!term || searching) return;
    setSearching(true);
    setSearchError(null);
    try {
      const found = await searchPlaces(term);
      setResults(found);
      // 결과가 없으면 시안처럼 방금 검색어를 직접 입력 필드에 미리 채워 둔다.
      if (found.length === 0) setDirectName(term);
      setMode("results");
    } catch (reason) {
      setSearchError(
        reason instanceof Error ? reason.message : "장소 검색에 실패했습니다",
      );
    } finally {
      setSearching(false);
    }
  };

  /** 결과를 고르면 장소명·지번주소·좌표를 들고 지도 화면으로 돌아간다. */
  const handlePick = (place: PlaceSearchResult) => {
    setSelected(place);
    setQuery(place.name);
    resetPin(place.position);
    setMode("map");
  };

  /** 직접 입력 등록. 장소명만 채우고, 주소·좌표는 이후 지도를 움직여 정한다. */
  const handleDirectRegister = () => {
    const name = directName.trim();
    if (!name) return;
    setSelected({ name, address: null });
    setQuery(name);
    resetPin();
    setMode("map");
  };

  /** mYJI1 시안의 직접 입력 묶음. 결과 없음 화면과 direct 모드가 같이 쓴다. */
  const directSection = (
    <>
      <Toast
        tone="info"
        message="직접 입력 후 지도를 움직여 핀으로 위치를 지정해주세요."
      />
      <TextField
        label="장소명 직접 입력"
        fieldSize="lg"
        placeholder="장소명을 입력해주세요"
        value={directName}
        onChange={(event) => setDirectName(event.target.value)}
        hint="지도에서 위치를 지정하면 주소가 자동으로 채워져요"
      />
      <Button
        size="lg"
        fullWidth
        disabled={!directName.trim()}
        onClick={handleDirectRegister}
      >
        장소명으로 등록하기
      </Button>
    </>
  );

  return (
    <AppShell
      topNavigation={
        <TopNavigation
          title="장소 등록"
          leading={<IconButton icon="arrow-left" label="뒤로가기" onClick={onBack} />}
        />
      }
    >
      <Container className="py-4 md:py-10">
        <NarrowColumn className="flex flex-col gap-4">
          {/* 모바일 TopNavigation 이 감춰진 데스크톱에서 되돌아갈 길. */}
          <button
            type="button"
            onClick={onBack}
            className="text-label-lg text-text-secondary hover:text-text-default hidden w-fit cursor-pointer items-center gap-1 md:inline-flex"
          >
            ← {backLabel}
          </button>

          <form onSubmit={handleSearch} noValidate>
            <TextField
              label="장소 검색"
              fieldSize="lg"
              leftIcon="search"
              placeholder="장소명 또는 주소를 입력해주세요"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              hint={searchHint}
              disabled={searching}
            />
          </form>

          {searchError && (
            <Toast
              tone="error"
              message={searchError}
              onClose={() => setSearchError(null)}
            />
          )}

          {mode === "map" && (
            <>
              {/* 모바일에서는 시안처럼 화면 끝까지 채우고, 넓어지면 컬럼 안으로 들어온다. */}
              <NaverMap
                clientId={naverMapClientId}
                center={selected?.position ?? SEOUL_CITY_HALL}
                onCenterChange={handleCenterChange}
                className="-mx-4 h-[510px] md:mx-0 md:rounded-2xl"
              />
              {/* 장소를 골랐거나 지도를 움직였으면 핀 위치의 주소를 보여준다. */}
              {(selected || pinAddress) && (
                <Card>
                  <CardBody className="p-4">
                    {selected && <CardTitle>{selected.name}</CardTitle>}
                    <CardDescription>{addressLine}</CardDescription>
                  </CardBody>
                </Card>
              )}
              {selected && (
                <Button
                  size="lg"
                  fullWidth
                  disabled={!confirmed}
                  onClick={() => confirmed && onConfirm(confirmed)}
                >
                  {confirmed
                    ? "이 위치로 등록하기"
                    : "지도를 움직여 위치를 지정해주세요"}
                </Button>
              )}
            </>
          )}

          {mode === "results" &&
            (results.length > 0 ? (
              <>
                <p className="text-label-lg text-text-secondary">
                  네이버 장소 검색 결과 · {results.length}곳
                </p>
                <ul className="flex flex-col gap-2">
                  {/* 같은 이름의 지점이 나란히 올 수 있어 인덱스를 키에 섞는다. */}
                  {results.map((place, index) => (
                    <li key={`${place.name}-${index}`}>
                      <Card
                        as="button"
                        type="button"
                        onClick={() => handlePick(place)}
                        className="w-full cursor-pointer text-left"
                      >
                        <CardBody className="p-4">
                          <CardTitle>{place.name}</CardTitle>
                          <CardDescription>
                            {place.address ?? "주소 정보가 없어요"}
                          </CardDescription>
                        </CardBody>
                      </Card>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => {
                    setDirectName(query.trim());
                    setMode("direct");
                  }}
                >
                  찾는 장소가 없나요? 직접 입력
                </Button>
              </>
            ) : (
              <>
                <EmptyState
                  icon="search"
                  iconTone="muted"
                  title="검색 결과가 없어요"
                  description="네이버 장소 검색에서 찾지 못했어요. 장소명만 직접 입력해 등록할 수 있어요."
                />
                {directSection}
              </>
            ))}

          {mode === "direct" && directSection}
        </NarrowColumn>
      </Container>
    </AppShell>
  );
}
