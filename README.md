# 포토폴리오 메인 페이지

Form 추가 레스토랑 이미지 여러개로 랜더링 할수있게 form UI/UX 작업 ( 미정)

# 방에 있는 음식점 필터( 지역 ,음식 분야 , 태그 등등) o 방법 안정함

- 1. 모바일 (버튼 클릭시 필터) , 데탑(텍스트 입력시 실시간 필터)
- 2. 둘다 ( 버튼 클릭시 필터)
- 3. 둘다 ( 텍스트 입력시 실시간 필터)
- select가 모바일시

# 방만들시 시작 lating 설정할수 있게 ui/ux작업 o

( addFrom 처럼 방만들기 클릭시 form 활성화 ,
create시 정보 emit로 전달하기,
마커로 마크한 좌표 표시 ( 1개만 )
)

# 유효성 검사 ( validation )

- 에러 알리는 방법 ( Error text , alert )
- addFrom은 레스토랑 이름만 검사하면 될듯
- userCreateForm 검사
- userLoginForm 검사

# 레스토랑 정보 수정

# 방찾기 할때도 필터 ( 방 제목 , 만든 유저 )

# UI/UX 예제 찾기

- tailwind template보고 윤곽잡기 or
- bootstrap 테마 구매 고민

# 모바일 하단 ( 틀만 잡음)

현재 들어가 있는 방 | 방찾기 | 마이 페이지

# 방 정보 구조 ( 틀만 잡음 )

방 이미지 | 방이름
----------| 👑방장

---

# 프론트에서 승인 대기중인 유저 요청 승락처리 구현 ( O )

# 방 서치 필터

- 방이름으로 필터
- 방장 유저 명으로 필터
- 지역 으로 필터

- post data 구조 = ( type: searchFilterType , data )
  searchFilterType {
  roomName,
  superUser,
  location
  }

# 레스토랑 서치 필터

--pc 사이드바
참여 중인 방
방 찾기
마이페이지
방 신청 유저 목록 ( 설정 )

방 정보 변경 ( 설정 , 백단 구현 o )
음식점 찾기 ( 필터 , 지도 에서 )
