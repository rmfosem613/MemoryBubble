// 단계별 내용 타입 정의
export interface StepContent {
  title: string;
  content: string;
}

// 단계별 콘텐츠 상수
export const FONT_STEP_CONTENTS: Record<number, StepContent> = {
  1: {
    title: '준비하기',
    content:
      '준비물: 태블릿, 펜, 충분한 시간\n\n' +
      '주의 사항:\n' +
      '• 펜 두께는 0.8mm(삼성노트는 33)로 설정, 색은 검정색으로 해주세요\n' +
      '• 글자는 네모 칸 안 상하좌우 여백을 남기고 제공된 글자 상자 안에 정확히 배치해주세요\n' +
      '• 폰트 제작은 평균 3시간 정도 소요됩니다.\n\n' +
      '폰트 제작을 위해 PDF 파일을 다운로드하여 작성해주세요.\n',
  },
  2: {
    title: '나의 손글씨 파일 업로드',
    content:
      '다운받은 PDF 파일에 나의 손글씨를 작성하여 업로드해주세요. 손글씨 작성 시 깔끔하게 작성해주세요.\n\n' +
      'PDF 파일은 여러 번 다운로드 받을 수 있습니다.\n\n' +
      '작성이 완료되었다면 다운받은 png 파일명을 변경하지 말고 그대로 업로드 해 주시길 바랍니다. \n',
  },
  3: {
    title: '폰트 정보 입력',
    content:
      '나만의 폰트 이름을 붙여주세요.\n' +
      '폰트 이름은 영문, 숫자, 특수문자를 포함할 수 있습니다. 폰트 설명에는 폰트의 특징이나 사용 목적 등을 자유롭게 작성하시면 됩니다.\n\n' +
      '주의사항:\n' +
      '• 타인의 권리가 있는 이름(유명인, 브랜드명, 상표권이 있는 명칭 등)은 사용할 수 없습니다.\n' +
      '• 노래 제목, 영화 제목 등은 사용 가능하나 법적 문제가 있는지 먼저 확인해 주세요.\n' +
      '• 욕설, 차별, 혐오, 비방 등의 표현은 사용할 수 없습니다.\n' +
      '• 법적 문제 발생 시 책임은 사용자에게 있습니다.',
  },
};  

// 기본 내용
export const DEFAULT_STEP_CONTENT: StepContent = {
  title: '안내',
  content: '단계를 선택하여 진행해주세요.',
};

// 단계 번호에 따른 콘텐츠 가져오기
export function getStepContent(stepNumber: number): StepContent {
  return FONT_STEP_CONTENTS[stepNumber] || DEFAULT_STEP_CONTENT;
}
