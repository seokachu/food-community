/**
 * 네이버 지도 JS SDK(v3)가 전역 `naver.maps` 로 노출하는 API 중
 * 이 프로젝트가 실제로 쓰는 부분만 선언한다. SDK 는 <script> 로 로드되어
 * npm 타입 패키지가 없고, 전부 옮겨 적으면 유지비만 늘어 쓰는 만큼만 둔다.
 */
declare namespace naver.maps {
  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  interface MapOptions {
    center?: LatLng;
    zoom?: number;
    draggable?: boolean;
    pinchZoom?: boolean;
    scrollWheel?: boolean;
    keyboardShortcuts?: boolean;
    disableDoubleClickZoom?: boolean;
    disableDoubleTapZoom?: boolean;
    disableTwoFingerTapZoom?: boolean;
  }

  class Map {
    constructor(container: HTMLElement, options?: MapOptions);
    /** 실제 반환형은 Coord 지만 이 프로젝트는 LatLng 로 만든 지도라 LatLng 로 좁혀 쓴다. */
    getCenter(): LatLng;
    panTo(latlng: LatLng): void;
    destroy(): void;
  }

  interface MarkerOptions {
    position: LatLng;
    map?: Map | null;
  }

  /** 좌표에 고정되는 기본 마커. 저장된 장소 위치를 보여주는 조회용 지도가 쓴다. */
  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    setPosition(position: LatLng): void;
  }

  namespace Event {
    /** 리스너 해제는 map.destroy() 가 함께 처리하므로 핸들 반환형은 선언하지 않는다. */
    function addListener(target: Map, eventName: string, listener: () => void): void;
  }
}

interface Window {
  naver?: { maps: typeof naver.maps };
  /** SDK 가 키 인증에 실패하면 호출하는 전역 훅. 이름은 SDK 가 정한 규약이다. */
  navermap_authFailure?: () => void;
}
