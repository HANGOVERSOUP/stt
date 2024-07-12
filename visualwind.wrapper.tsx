import React from 'react';

/**
* 1. GLOBAL CSS 파일을 여기에 추가하세요. 일반적인 후보들은 자동으로 추가됩니다 :
*/
import './src/app/globals.css';
import './src/styles/globals.css';

/**
 * 2. 전역으로 제공되어야 하는 <Provider />들을 설정하는 곳입니다.
 *    처음부터 설정하실 필요는 없고, 컴퍼넌트 isolated rendering이 실패했을 때, 이 파일로 돌아와서 상황에 맞게 추가하시면 됩니다.
 *    몇 가지 전형적인 예시를 주석 형태로 첨부하였습니다.
 *    몇 가지 전형적인 예시를 주석 형태로 첨부하였습니다.
 *    자세한 내용은 https://www.visualwind.dev/configuration 를 참조하세요.
 */
export default function Wrapper({ children: YOUR_COMPONENT }: React.PropsWithChildren): React.ReactElement {
	return (
    <>
      {/* Place global providers here, common providers are given below, for example:*/}
      {/* <ReactQueryProvider client={queryClient}>*/}
      {/* <ReduxProvider store={reduxStore}> */}
      {/* <ThemeProvider> */}
      {YOUR_COMPONENT}
      {/* </ThemeProvider> */}
      {/* </ReduxProvider> */}
      {/* </ReactQueryProvider> */}
    </>
  );
}

/**
 * 3. 이제 설정이 완료되었습니다. 다음 순서는:
 *    - 이 파일을 저장하세요,
 *    - 리액트 컴퍼넌트 파일을 열어보세요,
 *    - 우측 위에 푸른배경의 화살표 아이콘이 보일 거에요. 클릭하시면 렌더링됩니다.
 */