import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { Pressable, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, Header, Card, Button, Icon } from 'react-native-elements';
import {decode} from 'html-entities'

function MainView(props) {
  const [score, changeScore] = useState('0');
  const [questionNumber, changeQuestionNumber] = useState('0');
  const [questionList, changeQuestions] = useState({});
  const [answers, changeAnswers] = useState([]);

  // changePhase={changePhase} phase={phase} 
  let i = 0;
  function nextQuestion(){
    changeQuestionNumber((parseInt(questionNumber)+1).toString());
    fetch('https://opentdb.com/api.php?amount=1')
    .then((response) => response.json())
    .then((v) => {console.log(v); changeQuestions(v.results)})
    .then((v) => changeAnswers([[<CorrectAnswer nextQuestion={nextQuestion} score={score} updateScore={changeScore} answer={v[0].correct_answer} />]]))
    .then(function(){
      for(i=0; i < v[0].incorrect_answers.length ; i++){
        answers.push(<WrongAnswer nextQuestion={nextQuestion} answer={v[0].incorrect_answers[i]} />);
      }
    })
    .then(changeAnswers(shuffleDeck(answers)))
    .catch((error) => console.error(error));
  }

  useEffect(nextQuestion, []);

  if(props.view == "Splash"){
    return <Splash changeView={props.changeView}/>
  }
  else if(props.view == "Questions"){
    return (
      <View>
        <Questions orderedAnswers={answers} questionNumber={questionNumber} changeQuestionNumber={changeQuestionNumber} score={score} changeView={props.changeView} changeScore={changeScore} nextQuestion={nextQuestion}  changeQuestions={changeQuestions} questionList={questionList}/>
    </View>
    );
  }
};

function EndScreen(props){
  return(
    <View style={styles.splashContainer}>
      <Text style={styles.scoreText}>SCORE: {props.score}</Text>
      <Button 
            onPress={() => {props.changeQuestionNumber("0"); props.changeScore("0"); props.changeView("Splash")}}
            title="Back to start"
            color="#808080"
            />
    </View>
  );
}

function WrongAnswer(props){
  if(props.phase == "phase1"){
    return(
      <Pressable 
        onPress={() => {props.changePhase("phase2");}} 
        style={({pressed}) => pressed ?
        styles.pressed : styles.unpressed}
      >
        <Text selectable={false}
              style={styles.titleStyle}>
                {decode(props.answer)}
        </Text>
      </Pressable>
    )
  }
  else{
    setTimeout(() =>{ props.changePhase("phase1"); }, 3500);
    return(  
      <Pressable 
        style={styles.WrongAnswer}
      >
        <Text selectable={false}
              style={styles.titleStyle}>
                {decode(props.answer)}
        </Text>
      </Pressable>
    )
  }

  
}

function CorrectAnswer(props){
  if(props.phase == "phase1"){
    return(
      <Pressable 
        style={({pressed}) => pressed ?
        styles.pressed : styles.unpressed}
        onPress={() => {props.changePhase("phase2"); props.updateScore((parseInt(props.score)+1).toString());}} 
      >
        <Text selectable={false}
              style={styles.titleStyle}>
                {decode(props.answer)}
        </Text>
      </Pressable>
    )
  }
  else{
    setTimeout(() =>{ props.changePhase("phase1"); props.nextQuestion(); }, 3000);
    return(  
      <Pressable 
        style={styles.rightAnswer}
      >
        <Text selectable={false}
              style={styles.titleStyle}>
                {decode(props.answer)}
        </Text>
      </Pressable>
    )
  }
}

//https://stackoverflow.com/questions/62500419/react-native-shuffle-flat-list-array
function shuffleDeck(array){
  let i = array.length - 1;
  for (i ; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};
function AnswerArray(props){
  const [phase, changePhase] = useState('phase1');
  let answers = [<CorrectAnswer changePhase={changePhase} phase={phase} nextQuestion={props.nextQuestion} score={props.score} updateScore={props.updateScore} answer={props.questionList[0].correct_answer} />];
  for(let  i = 0; i < props.questionList[0].incorrect_answers.length ; i++){
    answers.push(<WrongAnswer changePhase={changePhase} phase={phase} nextQuestion={props.nextQuestion} answer={props.questionList[0].incorrect_answers[i]} />);
  }
  // let orderedAnswers = shuffleDeck(answers);
  // useEffect(()=>{orderedAnswers = shuffleDeck(answers)}, []);
  return(
    <View>
      {props.orderedAnswers}
    </View>
  );
}

function Splash(props){
  return(
    <View style={styles.splashContainer}>
      <ImageBackground source={require('./background.png')}  style={styles.image} >
        <Text style={styles.appName}>Trivia Time</Text>
        <Button 
              onPress={() => {props.changeView("Questions")}}
              title="Test yourself!"
              color="#f194ff"
              />
      </ImageBackground>
    </View>
  );
}

function Questions(props){
  if(parseInt(props.questionNumber) > 4){
    return(
    <EndScreen changeQuestionNumber={props.changeQuestionNumber} score={props.score} changeScore={props.changeScore} changeView={props.changeView}/>);
  }
  else{
    return(
      <View>
        <View style={styles.scoreBoard}>
          <Text style={styles.scoreBoardText}>Score: {props.score}</Text>
        </View>
        <View style={styles.question}>
          <Text style={styles.questionStyle}> {decode(props.questionList[0].question)} </Text>
        </View>
        <AnswerArray orderedAnswers={props.orderedAnswers} score={props.score} updateScore={props.changeScore} nextQuestion={props.nextQuestion} questionList={props.questionList}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  splashContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
    width: '100%',
    height: '100%'
  },
  image: {
    flex: 1,
    width: '100%',
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: 'center',
  },
  container: {
    marginTop: 5,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  question: {
    color: '#fff',
    padding: 100,
    margin: 30,
    backgroundColor: 'green',
    borderWidth: 2,
    height: 44,
    elevation: 30,
    justifyContent: 'center'
  },
  questionStyle:{
    color:'ivory',
    fontSize: 18,
  },
  scoreBoard:{
    borderWidth: 2,
    margin: 20,
    padding: 30,
    justifyContent: 'center'
  },
  scoreBoardText:{
    fontSize: 20,
  },
  unpressed: {
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'center',
    backgroundColor: 'rgb(45,65,90)',
    borderRadius: 8,
    margin: 6,
    elevation: 10,
    padding: 10,
    margin: 10
  },
  pressed: {
    borderColor: 'white',
    borderWidth: 1,
    justifyContent: 'center',
    backgroundColor: 'rgb(90,130,180)',
    borderRadius: 8,
    margin: 6,
    elevation: 10,
    padding: 10,
    margin: 10
  },    
  rightAnswer: {
    borderColor: 'white',
    borderWidth: 1,
    justifyContent: 'center',
    backgroundColor: 'rgb(0,130,0)',
    borderRadius: 8,
    margin: 6,
    elevation: 10,
    padding: 10,
    margin: 10
  },
  WrongAnswer: {
    borderColor: 'white',
    borderWidth: 1,
    justifyContent: 'center',
    backgroundColor: 'rgb(130,0,0)',
    borderRadius: 8,
    margin: 6,
    elevation: 10,
    padding: 10,
    margin: 10
  },
  titleStyle: {
    fontWeight: 'bold',
    color: 'ivory',
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 8,
    marginTop: 4,
    marginBottom: 4,
  },
  appName: {
    marginBottom: 100,
    fontFamily: "Roboto",
    fontWeight: 'bold',
    fontSize: 50,
    textShadowColor: 'black',
    color: '#000000'
  },
  scoreText: {
    marginBottom: 100,
    fontFamily: "Roboto",
    fontWeight: 'bold',
    color: 'black',
    fontSize: 24,
    textShadowColor: 'black'
  }
});

export default function AppWrapper(){
  const [view, changeView] = useState("Splash");
  return(
    <SafeAreaProvider>
      <ThemeProvider useDark={true}>
      <Header
          leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{ text: 'Trivia Time', style: { color: '#fff' } }}
          rightComponent={{ icon: 'home', onPress: ()=> {changeView("Splash")}  , color: '#fff' }}
        />
        <MainView view={view} changeView={changeView}/>
        <StatusBar style="auto"/>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}