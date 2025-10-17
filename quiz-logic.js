// 퀴즈 로직 구현
class BonoQuiz {
  constructor() {
    this.currentQuestions = []
    this.currentQuestionIndex = 0
    this.score = 0
    this.lives = 3
    this.timer = null
    this.timeLeft = 10
    this.isAnswered = false

    this.initializeElements()
    this.bindEvents()
  }

  initializeElements() {
    // 화면 요소들
    this.startScreen = document.getElementById("start-screen")
    this.quizScreen = document.getElementById("quiz-screen")
    this.resultScreen = document.getElementById("result-screen")

    // 시작 화면 요소들
    this.startBtn = document.getElementById("start-btn")

    // 퀴즈 화면 요소들
    this.questionCounter = document.getElementById("question-counter")
    this.scoreDisplay = document.getElementById("score-display")
    this.timerElement = document.getElementById("timer")
    this.questionText = document.getElementById("question-text")
    this.optionsContainer = document.getElementById("options-container")

    // 결과 화면 요소들
    this.resultTitle = document.getElementById("result-title")
    this.resultMessage = document.getElementById("result-message")
    this.finalScore = document.getElementById("final-score")
    this.resultBonoImage = document.getElementById("result-bono-image")
    this.restartBtn = document.getElementById("restart-btn")
  }

  bindEvents() {
    this.startBtn.addEventListener("click", () => this.startQuiz())
    this.restartBtn.addEventListener("click", () => this.restartQuiz())
  }

  startQuiz() {
    // 랜덤하게 10문제 선택
    this.currentQuestions = getRandomQuestions(10)
    this.currentQuestionIndex = 0
    this.score = 0
    this.lives = 3

    // 화면 전환
    this.showScreen("quiz-screen")
    this.updateProgress()
    this.showQuestion()
  }

  showScreen(screenId) {
    // 모든 화면 숨기기
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.remove("active")
    })

    // 선택된 화면 보이기
    document.getElementById(screenId).classList.add("active")
  }

  updateProgress() {
    this.questionCounter.textContent = `${this.currentQuestionIndex + 1} / 10`
    this.scoreDisplay.textContent = `점수: ${this.score} | 기회: ${this.lives}`
  }

  showQuestion() {
    if (this.currentQuestionIndex >= this.currentQuestions.length) {
      this.showResult()
      return
    }

    // 진행 상황 업데이트
    this.updateProgress()

    const question = this.currentQuestions[this.currentQuestionIndex]
    this.questionText.textContent = question.question

    // 선택지 생성
    this.optionsContainer.innerHTML = ""
    question.options.forEach((option, index) => {
      const button = document.createElement("button")
      button.className = "option-button"
      button.textContent = `${index + 1}. ${option}`
      button.addEventListener("click", () => this.selectAnswer(index))
      this.optionsContainer.appendChild(button)
    })

    // 타이머 시작
    this.startTimer()
    this.isAnswered = false
  }

  startTimer() {
    this.timeLeft = 10
    this.timerElement.textContent = this.timeLeft

    this.timer = setInterval(() => {
      this.timeLeft--
      this.timerElement.textContent = this.timeLeft

      if (this.timeLeft <= 0) {
        this.timeUp()
      }
    }, 1000)
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  selectAnswer(selectedIndex) {
    if (this.isAnswered) return

    this.isAnswered = true
    this.stopTimer()

    const question = this.currentQuestions[this.currentQuestionIndex]
    const isCorrect = selectedIndex === question.answer

    // 선택된 버튼에 스타일 적용
    const buttons = this.optionsContainer.querySelectorAll(".option-button")
    buttons[selectedIndex].classList.add("selected")

    // 정답 버튼에 스타일 적용
    if (!isCorrect) {
      buttons[question.answer].style.background = "linear-gradient(135deg, #98FB98, #87CEEB)"
      buttons[question.answer].style.border = "3px solid #32CD32"
    } else {
      buttons[selectedIndex].style.background = "linear-gradient(135deg, #98FB98, #87CEEB)"
      buttons[selectedIndex].style.border = "3px solid #32CD32"
    }

    // 점수 업데이트
    if (isCorrect) {
      this.score++
      this.updateProgress() // 점수 즉시 업데이트
    }

    // 모든 버튼 비활성화
    const allButtons = this.optionsContainer.querySelectorAll(".option-button")
    allButtons.forEach((button) => {
      button.disabled = true
    })

    // 오답인 경우 기회 차감 후 처리
    if (!isCorrect) {
      this.lives = Math.max(0, this.lives - 1)
      this.updateProgress()
    }

    setTimeout(() => {
      // 남은 기회가 없으면 결과 화면으로
      if (this.lives <= 0) {
        this.showResult()
        return
      }

      // 다음 문제로 진행 (마지막 문제를 넘기면 결과 표시)
      this.currentQuestionIndex++
      if (this.currentQuestionIndex >= this.currentQuestions.length) {
        this.showResult()
      } else {
        this.showQuestion()
      }
    }, 2000)
  }

  timeUp() {
    if (this.isAnswered) return

    this.isAnswered = true
    this.stopTimer()

    // 모든 버튼 비활성화
    const buttons = this.optionsContainer.querySelectorAll(".option-button")
    buttons.forEach((button) => {
      button.disabled = true
    })

    // 정답 표시
    const question = this.currentQuestions[this.currentQuestionIndex]
    buttons[question.answer].style.background = "linear-gradient(135deg, #98FB98, #87CEEB)"
    buttons[question.answer].style.border = "3px solid #32CD32"

    // 시간 초과: 기회 차감 후 처리
    this.lives = Math.max(0, this.lives - 1)
    this.updateProgress()

    setTimeout(() => {
      if (this.lives <= 0) {
        this.showResult()
        return
      }

      this.currentQuestionIndex++
      if (this.currentQuestionIndex >= this.currentQuestions.length) {
        this.showResult()
      } else {
        this.showQuestion()
      }
    }, 2000)
  }

  showResult() {
    this.showScreen("result-screen")
    this.finalScore.textContent = this.score

    if (this.score === 10) {
      // 만점
      this.resultTitle.textContent = "축하합니다!"
      this.resultMessage.textContent = "당신은 보노보노의 소중한 친구에요."
      this.resultBonoImage.classList.add("spinning")
    } else {
      // 만점이 아닌 경우
      this.resultTitle.textContent = "결과"
      this.resultMessage.textContent = `현재까지 맞춘 개수: ${this.score}개\n보노보노와 조금 더 친해져 보아요!`
      this.resultBonoImage.classList.remove("spinning")
    }
  }

  restartQuiz() {
    // 회전 애니메이션 제거
    this.resultBonoImage.classList.remove("spinning")

    // 초기 화면으로 돌아가기
    this.showScreen("start-screen")
  }
}

// 페이지 로드 시 퀴즈 초기화
document.addEventListener("DOMContentLoaded", () => {
  new BonoQuiz()
})
