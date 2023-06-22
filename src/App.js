import './custom.scss';
import 'bulma/css/bulma.min.css';
import './QuestionCard.css';
// import { useNavigate } from "react-router";

import quizData from './data/quizData.json';
import React, { useState, useEffect } from 'react';

function App() {
  //const uri = require('./ec2_uri');
  const questionDelay = 1000;
  const [quizDataState, setQuizDataState] = useState(quizData);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const currentSection = quizDataState.sections[currentSectionIndex];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = quizDataState.sections[currentSectionIndex].questions[currentQuestionIndex];
  const [endQuiz, setEndQuiz] = useState(0);

  const goToPreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentQuestionIndex(0);
    }
  };

  useEffect(() => {
    console.log(quizDataState);
  }, [quizDataState]);


  const shuffleQuestionsInCurrentSection = () => {
    const currentQuestions = [...currentSection.questions];

    if (currentSection.shuffleQuestions) {
      for (let i = currentQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentQuestions[i], currentQuestions[j]] = [currentQuestions[j], currentQuestions[i]];
      }
    }

    for (let i = 0; i < currentQuestions.length; i++) {
      const currentQuestion = currentQuestions[i];
      if (currentSection.shuffleOptions && !currentQuestion.noShuffle) {
        const currentAnswers = [...currentQuestion.answers];
        for (let j = currentAnswers.length - 1; j > 0; j--) {
          const k = Math.floor(Math.random() * (j + 1));
          [currentAnswers[j], currentAnswers[k]] = [currentAnswers[k], currentAnswers[j]];
        }
        currentQuestions[i] = {
          ...currentQuestion,
          answers: currentAnswers,
        };
      }
    }

    const updatedQuizDataState = {
      ...quizDataState,
      sections: quizDataState.sections.map((section, index) => {
        if (index === currentSectionIndex) {
          return {
            ...section,
            questions: currentQuestions,
          };
        }
        return section;
      }),
    };
    setQuizDataState(updatedQuizDataState);
  };


  const goToNextSection = () => {
    if (currentSectionIndex < quizDataState.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const goToEnd = () => {
    setEndQuiz(1);
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizDataState.sections[currentSectionIndex].questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };


  function selectAnswer(answerId, questionId) {
    if (questionId === undefined) {
      if (quizDataState.sections[currentSectionIndex].questions[currentQuestionIndex].userValue === null) {
        setQuizDataState((prevState) => {
          const updatedSections = prevState.sections.map((section, sectionIndex) => {
            if (sectionIndex === currentSectionIndex) {
              const updatedQuestions = section.questions.map((question, questionIndex) => {
                if (questionIndex === currentQuestionIndex) {
                  return {
                    ...question,
                    userValue: answerId
                  };
                } else {
                  return question;
                }
              });
    
              return {
                ...section,
                questions: updatedQuestions
              };
            } else {
              return section;
            }
          });
    
          return {
            ...prevState,
            sections: updatedSections
          };
        });

        if (currentSection.type === 'card') {
          setTimeout(() => {
            goToNextQuestion();
          }, questionDelay);
        }
      }
    } else {
      const currentQuestionIndex = quizDataState.sections[currentSectionIndex].questions.findIndex((question) => question.id === questionId);
      // quizData.sections[currentSectionIndex].questions[questionIndex].userValue = answerId;
      // the above line changes the data directly, the below is doing the SAME via REACT satate method
      // console.log(currentSectionIndex);
      setQuizDataState((prevState) => {
        const updatedSections = prevState.sections.map((section, sectionIndex) => {
          if (sectionIndex === currentSectionIndex) {
            const updatedQuestions = section.questions.map((question, questionIndex) => {
              if (questionIndex === currentQuestionIndex) {
                return {
                  ...question,
                  userValue: answerId
                };
              } else {
                return question;
              }
            });
  
            return {
              ...section,
              questions: updatedQuestions
            };
          } else {
            return section;
          }
        });
  
        return {
          ...prevState,
          sections: updatedSections
        };
      });
    }
  }

  function selectAnswerrrrr(answerId, questionId) {
    if (questionId === undefined) {
      if (quizDataState.sections[currentSectionIndex].questions[currentQuestionIndex].userValue === null) {
        const updatedQuizDataState = {
          ...quizDataState,
          sections: quizDataState.sections.map((section, index) => {
            if (index === currentSectionIndex) {
              return {
                ...section,
                questions: section.questions.map((question, questionIndex) => {
                  if (questionIndex === currentQuestionIndex) {
                    return {
                      ...question,
                      userValue: answerId,
                    };
                  }
                  return question;
                }),
              };
            }
            return section;
          }),
        };
        console.log('User input:', updatedQuizDataState);
        setQuizDataState(updatedQuizDataState);
        localStorage.setItem('quizDataState', JSON.stringify(quizDataState));
        if (currentSection.type === 'card') {
          setTimeout(() => {
            goToNextQuestion();
          }, questionDelay);
        }
      }
    } else {
      const questionIndex = quizDataState.sections[currentSectionIndex].questions.findIndex((question) => question.id === questionId);
      // quizData.sections[currentSectionIndex].questions[questionIndex].userValue = answerId;
      // the above line changes the data directly, the below is doing the SAME via REACT satate method
      const updatedQuizDataState = {
        ...quizDataState,
        sections: quizDataState.sections.map((section, index) => {
          if (index === currentSectionIndex) {
            return {
              ...section,
              questions: section.questions.map((question, index) => {
                if (index === questionIndex) {
                  console.log("changing state: question ID: " + question.id + ", previous value: " + question.userValue + " new value: " + answerId);
                  return {
                    ...question,
                    userValue: answerId,
                  };
                }
                return question;
              }),
            };
          }
          return section;
        }),
      };
      setQuizDataState(updatedQuizDataState);
    }
  }

  function QuestionNavigation() {
    return (
      <div>
        <button onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0}>
          Previous
        </button>
        <button onClick={goToNextQuestion} disabled={currentQuestionIndex === quizData.sections[currentSectionIndex].questions.length - 1}>
          Next
        </button>
      </div>
    );
  }

  function updateEmail() {
    fetch('http://localhost:5050/quizData', {
    // fetch('/quizData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quizDataState),
    }).then(response => {
        if (response.ok) {
          console.log('Quiz data saved successfully');
        } else {
          throw new Error('Error saving quiz data');
        }
      }).catch(error => {
        console.error('Error saving quiz data:', error);
      });
  }
  

  function SectionNavigation() {
    return (
      <div>
        <button onClick={goToPreviousSection} disabled={currentSectionIndex === 0}>
          Previous Section
        </button>
        <button onClick={goToNextSection} disabled={currentSectionIndex === quizData.sections.length - 1}>
          Next Section
        </button>
        <button onClick={goToEnd}>
          End Quiz
        </button>
        <button onClick={shuffleQuestionsInCurrentSection}>
          Shuffle Section
        </button>
        <button onClick={updateEmail}>
          Submit Data
        </button>
      </div>
    );
  }

  function EmailQuestion({ question }) {
    const handleInputChange = (event) => {
      const answerValue = event.target.value;
      selectAnswer(answerValue, question.id);
    };
    return (
      <div className="field is-horizontal mb-4">
        <div className="field-label is-normal">
          <label className="label">{question.text}:</label>
        </div>
        <div className="field-body is-flex-direction-column">
          <div className="control is-flex">
            <input
              className="input"
              type="email"
              placeholder={question.altText}
              onBlur={handleInputChange}
              defaultValue={question.userValue === null ? '' : question.userValue}
            />
          </div>
        </div>
      </div>
    );
  }

  function TextQuestion({ question }) {
    const handleInputChange = (event) => {
      const answerValue = event.target.value;
      selectAnswer(answerValue, question.id);
    };
    return (
      <div className="field is-horizontal mb-4">
        <div className="field-label is-normal">
          <label className="label">{question.text}:</label>
        </div>
        <div className="field-body is-flex-direction-column">
          <div className="control is-flex">
            <input
              className="input"
              type="text"
              name={question.text} id={question.text} autoComplete={question.text}
              placeholder={question.altText}
              onBlur={handleInputChange}
              // defaultValue={question.userValue === null ? '' : question.userValue}
              defaultValue={question.userValue}
            />
          </div>
        </div>
      </div>
    );
  }

  function DropdownQuestion({ question }) {
    const handleSelectChange = (event) => {
      const selectedAnswerId = event.target.value;
      selectAnswer(selectedAnswerId, question.id);
    };
    const selectedAnswerId = question.userValue !== null ? question.userValue : 0;

    return (
      <div className="field is-horizontal mb-4">
        <div className="field-label is-normal">
          <label className="label">{question.text}:</label>
        </div>
        <div className="field-body is-flex-direction-column">
          <div className="control is-flex">
            <div className="select">
              <select onChange={handleSelectChange} defaultValue={selectedAnswerId}>
                <option disabled value="0">{question.altText}</option>
                {question.answers.map((answer) => (
                  <option key={answer.id} value={answer.id}>
                    {answer.text}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // radio button selection has error, 
  // maybe rendering/react/state related issue, or a race condition
  // copnsole logs show value changing
  // changed code to use reactstate, still update/render issue with radio button
  // similar problem may occur for multiple selection question type as well, checbox
  // issue to be resolved LATER
  function RadioButtonQuestion({ question }) {
    const handleRadioChange = (event) => {
      const selectedAnswerId = event.target.value;
      console.log("radio change event with question ID: " + question.id + ", and Answer ID is: " + selectedAnswerId);
      selectAnswer(selectedAnswerId, question.id);
    };
    return (
      <div className="field is-horizontal mb-4">
        <div className="field-label is-normal">
          <label className="label">{question.text}:</label>
        </div>
        <div className="field-body is-flex-direction-column">
          <div className="control is-flex is-flex-wrap-wrap">
            {question.answers.map((answer) => (
              <label key={answer.id} className="radio">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={answer.id}
                  onChange={handleRadioChange}
                  defaultChecked={answer.id === question.userValue}
                />
                <span className="ml-2">{answer.text}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  }



  function CardView() {
    const renderQuestionContent = () => {
      if (currentQuestion.mediaType === 'text') {
        return <p className='is-size-3 has-text-weight-medium'>{currentQuestion.text}</p>;
      } else if (currentQuestion.mediaType === 'image') {
        return <img src={currentQuestion.mediaURL} alt={currentQuestion.altText} />;
      } else if (currentQuestion.mediaType === 'video') {
        return <img src={currentQuestion.mediaURL} alt={currentQuestion.altText} />;
      }
      // Add more conditionals for other question types (e.g., audio, video)
    };

    const renderAnswerOptions = () => {
      // const checkSelectedAnswer = currentQuestion.correctAnswerId === 'page' ? (<PageView />) : (<CardView />)
      return currentQuestion.answers.map((answer) => (
        <button onClick={() => selectAnswer(answer.id)}
          className={`answer-card ${currentQuestion.userValue === null ? '' : currentQuestion.userValue === answer.id ? 'selected-answer' : currentQuestion.correctAnswerId === answer.id ? 'correct-answer' : 'wrong-answer'}`}
          key={answer.id}>
          {/* we have both type and mediaType property in answer */}
          {/* {answer.type === 'text'  && <p className={`is-size-3 has-text-weight-medium ${ currentQuestion.userValue === null ? '' : currentQuestion.correctAnswerId === answer.id ? 'correct-answer' : 'wrong-answer' }`}>{answer.text}</p>} */}
          {answer.type === 'text' && <p className="is-size-3 has-text-weight-medium">{answer.text}</p>}
          {answer.type === 'image' && <img src={answer.mediaURL} alt={answer.altText} />}
          {answer.type === 'video' && <img src={answer.mediaURL} alt={answer.altText} />}
        </button>
      ));
    };
    return (
      <div className="card-view-container">
        <div className="question-card">
          <h2>{currentQuestion.text}</h2>
          <div className="question-content">{renderQuestionContent()}</div>
        </div>
        <div className="answer-cards">{renderAnswerOptions()}</div>
        <h2>{currentQuestion.userValue}</h2>
      </div>
    );
  }

  function PageView() {
    return (
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">
            {currentSection.title}
          </p>
        </header>
        <div className="card-content">
          <form className="is-horizontal">
            {currentSection.questions.map((question) => (
              <div key={question.id}>
                {question.type === 'email' && (
                  <EmailQuestion question={question} />
                )}
                {question.type === 'text' && (
                  <TextQuestion question={question} />
                )}
                {question.type === 'dropdown' && (
                  <DropdownQuestion question={question} />
                )}
                {question.type === 'radioButton' && (
                  <RadioButtonQuestion question={question} />
                )}
              </div>
            ))}
          </form>
        </div>
      </div>
    );
  }

  function HeaderForApp() {
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="https://bulma.io">
            <img src="./psl-logo.png" width="112" height="28" />
          </a>

          <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <a className="navbar-item">
              Class: {quizData.Quiz.Class}-{quizData.Quiz.Section}
            </a>
            <a className="navbar-item">
              Author: {quizData.Quiz.Author}
            </a>

            <a className="navbar-item">
              Description: {quizData.Quiz.Description}
            </a>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <a className="button is-primary">
                  <strong>Quiz ID: {quizData.Quiz.QuizID}</strong>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  function PersonalInformation({ questionTag }) {
    console.log(questionTag.text + ' ' + questionTag.userValue + '.');
    return (
      <p className="control">
        <a className="button">
          {questionTag.text}: {questionTag.userValue}
        </a>
      </p>
    );
  }

  function SummaryPage() {
    return (
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">
            Quiz Summary
          </p>
        </header>
        <div className="card-content">
          <form className="is-horizontal">

            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label">Quiz ID</label>
              </div>
              <div className="field-body">
                <p className="control">
                  <a className="button is-static">
                    {quizData.Quiz.QuizID}
                  </a>
                </p>
              </div>

              <div className="field-label is-normal">
                <label className="label">Class & Section</label>
              </div>
              <div className="field-body">
                <p className="control">
                  <a className="button is-static">
                    {quizData.Quiz.Class}-{quizData.Quiz.Section}
                  </a>
                </p>
              </div>

              <div className="field-label is-normal">
                <label className="label">Department</label>
              </div>
              <div className="field-body">
                <p className="control">
                  <a className="button is-static">
                    {quizData.Quiz.Department}
                  </a>
                </p>
              </div>

            </div>
            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label">Author</label>
              </div>
              <div className="field-body">
                <p className="control">
                  <a className="button is-static">
                    {quizData.Quiz.Author}
                  </a>
                </p>
              </div>

            </div>

            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label">Description</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control is-expended">
                    <textarea className="textarea" value={quizData.Quiz.Description} readOnly></textarea>
                  </p>
                </div>
              </div>
            </div>
            <hr></hr>
            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label">Personal Information:</label>
              </div>
              <div className="field is-grouped is-grouped-multiline">
                {quizDataState.sections[0].questions.map((question, index) => <PersonalInformation key={index} questionTag={question} />)}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <HeaderForApp />
      <section className="section">
        <div className="columns is-vcentered">
          <div className="column is-four-fifths is-offset-1">
            {endQuiz === 1 ? (<SummaryPage />) :
              (<>
                {currentSection.type === 'page' ? (<PageView />) : (<CardView />)}
                {currentSection.type === 'page' ? ('') : (<QuestionNavigation />)}
              </>
              )
            }
            <div className="card">
              <SectionNavigation />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;