import { PlaceForm } from "./PlaceForm";

/**
 * 서버 컴포넌트 래퍼. 네이버 지도 키를 서버 환경변수에서 읽어 프롭으로 내려보낸다.
 *
 * NEXT_PUBLIC_ 접두사를 쓰지 않는 프로젝트 규칙 때문에 이 경로를 거친다.
 * 키 자체는 도메인 제한이 걸린 공개 키라 스크립트 URL 로 브라우저에 노출돼도 된다.
 */
export default function RegisterPage() {
  return <PlaceForm naverMapClientId={process.env.NAVER_MAP_CLIENT_ID ?? ""} />;
}
