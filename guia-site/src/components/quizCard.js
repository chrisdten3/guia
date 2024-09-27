import React, { useState } from 'react';

const QuizCard = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleNextQuestion = () => {
    const correctAnswer = questions[currentQuestionIndex].correct_answer;
    if (selectedOption === correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(''); // Reset selected option for the next question
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption('');
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="quiz-result">
        <h3>Your Score: {score} / {questions.length}</h3>
        <button onClick={restartQuiz}>Restart Quiz</button>
      </div>
    );
  }

  return (
    <div className="quiz-card">
      <h3>{questions[currentQuestionIndex].question}</h3>
      <form>
        {Object.keys(questions[currentQuestionIndex].options).map((key) => (
          <label key={key}>
            <input
              type="radio"
              value={key}
              checked={selectedOption === key}
              onChange={handleOptionChange}
            />
            {key}. {questions[currentQuestionIndex].options[key]}
          </label>
        ))}
      </form>
      <button onClick={handleNextQuestion} disabled={!selectedOption}>
        Next Question
      </button>
    </div>
  );
};
