import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { Pressable, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, Header, Card, Button, Icon, BottomSheet, ListItem, withTheme } from 'react-native-elements';
import {decode} from 'html-entities';

function MainView(props) {
  // There is a state for the view which exists in the app wraper at like 440, which gets passed into MainView
  const [numQuestions, changeNumQuestions] = useState(5); // State that tracks the number of questions the user is asked
  const [difficulty, changeDifficulty] = useState("");  // State that tracks the difficult of the questions asked
  const [score, changeScore] = useState('0'); // State that tracks score 
  const [questionNumber, changeQuestionNumber] = useState("0");  // State that tracks the current question number, 
  const [questionList, changeQuestions] = useState(); // State that contains question and answer it gets from the API
  
  function newQuestion(){ //Gets the questions from api and enters it into questionList, increments question number by 1
    changeQuestionNumber((parseInt(questionNumber)+1).toString());
    fetch('https://opentdb.com/api.php?amount=1' + difficulty)
    .then((response) => response.json())
    .then((v) => {changeQuestions(v.results)})
    .catch((error) => console.error(error));
  }

  useEffect(newQuestion, []);

  if(props.view == "Splash"){
    return <Splash newQuestion={newQuestion} changeDifficulty={changeDifficulty} changeNumQuestions={changeNumQuestions} changeScore={changeScore} changeQuestionNumber={changeQuestionNumber} changeView={props.changeView}/>
  }
  else if(props.view == "Questions"){
    return (
        <Questions numQuestions={numQuestions} questionNumber={questionNumber} questionList={questionList} score={score} changeQuestionNumber={changeQuestionNumber} changeView={props.changeView} changeScore={changeScore} newQuestion={newQuestion}/>
    );
  }
};

/*******************************************************************************/
/*******************************************************************************/
                          // Splash Screen
                          // Splash Screen
/*******************************************************************************/
/*******************************************************************************/

// Splash Page
function Splash(props){
  const [questionAmountChoiceIsVisible, setQuestionAmountChoiceIsVisible] = useState(false);  // Tracks state for the question num bottom drawer
  const [difficultyChoiceIsVisible, setDifficultyChoiceIsVisible] = useState(false);  // Tracks state for difficulty bottom drawer

  return(
    <View style={styles.splashContainer}>
      <ImageBackground source={require('./background.png')}  style={styles.image} >
        <Button 
          disabled = {true}
          title="Timed Mode"
        />
        <Text style={styles.appName}>Trivia Time</Text>
        <Button     // Triggers question amount bottom drawer
          onPress={() => {setQuestionAmountChoiceIsVisible(true);}}
          title="Change num questions"
        />
        <ConfigButton
              setDifficultyChoiceIsVisible={setDifficultyChoiceIsVisible} 
              title="Change difficulty"
              />
        <BetterButton
          changeView = {props.changeView}
          newQuestion = {props.newQuestion}
          changeQuestionNumber = {props.changeQuestionNumber}
          changeQuestionNumber = {props.changeQuestionNumber}   
          changeScore = {props.changeScore}   
          title={"Test yourself!"}
        />
        <QuestionAmount changeNumQuestions={props.changeNumQuestions} setIsVisible={setQuestionAmountChoiceIsVisible} isVisible={questionAmountChoiceIsVisible} />
        <DifficultyChoice changeDifficulty={props.changeDifficulty} setIsVisible={setDifficultyChoiceIsVisible} isVisible={difficultyChoiceIsVisible} />
      </ImageBackground>
    </View>
  );
}

// Question Amount bottom drawer
function QuestionAmount(props){
  const list = [
    { title: '3' , onPress: () => {props.changeNumQuestions(3); props.setIsVisible(false);}},
    { title: '5' , onPress: () => {props.changeNumQuestions(5); props.setIsVisible(false);}},
    { title: '10' , onPress: () => {props.changeNumQuestions(10); props.setIsVisible(false);}},
    { title: '15' , onPress: () => {props.changeNumQuestions(15); props.setIsVisible(false);}},
    { title: '20' , onPress: () => {props.changeNumQuestions(20); props.setIsVisible(false);}},
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: 'red' },
      titleStyle: { color: 'white' },
      onPress: () => props.setIsVisible(false),
    },
  ];
  return(
    <BottomSheet
          isVisible={props.isVisible}
          containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
        >
          {list.map((l, i) => (
            <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
              <ListItem.Content>
                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </BottomSheet>
  );
}

// Difficulty bottom drawer
function DifficultyChoice(props){
  const list = [
    { title: 'Random' , onPress: () => {props.changeDifficulty("");props.setIsVisible(false);}},
    { title: 'Easy' , onPress: () => {props.changeDifficulty("&difficulty=easy");props.setIsVisible(false);}},
    { title: 'Medium' , onPress: () => {props.changeDifficulty("&difficulty=medium");props.setIsVisible(false);}},
    { title: 'Hard' , onPress: () => {props.changeDifficulty("&difficulty=hard");props.setIsVisible(false);}},
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: 'red' },
      titleStyle: { color: 'white' },
      onPress: () => props.setIsVisible(false),
    },
  ];
  return(
    <BottomSheet
          isVisible={props.isVisible}
          containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
        >
          {list.map((l, i) => (
            <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
              <ListItem.Content>
                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </BottomSheet>
  );
}

// Triggers difficulty bottom drawer
function ConfigButton(props){
  return(
    <Pressable
    onPress={() => {props.setDifficultyChoiceIsVisible(true);}}
        style={({ pressed }) => [
          styles.item,
          styles.wrapperCustom,
          {
            backgroundColor: pressed
              ? 'white'
              : 'green'
          },
        ]}
      > 
      <Text selectable={false}
        style={styles.titleStyle}>
        {props.title}
      </Text>
      </Pressable>
    );
}

// Triggers game start
function BetterButton(props){
  return(
    <Pressable
      onPress={() => {props.changeView("Questions"); props.newQuestion(); props.changeQuestionNumber("0"); props.changeScore("0");}}
        style={({ pressed }) => [
          styles.item,
          styles.wrapperCustom,
          {
            backgroundColor: pressed
              ? 'white'
              : 'grey'
          },
        ]}
      > 
      <Text selectable={false}
        style={styles.titleStyle}>
        {props.title}
      </Text>
      </Pressable>
    );
}

/*******************************************************************************/
/*******************************************************************************/
                          // Questions Screen
                          // Questions Screen
/*******************************************************************************/
/*******************************************************************************/

// displays a question and answers
// changes score and diplays wether the answer was right or wrong
// based on user interaction
function Questions(props){
  if(parseInt(props.questionNumber) >= props.numQuestions){   // if user answers numAnswer amount of question, triggers end screen
    return(
      <EndScreen score={props.score} changeView={props.changeView}/>
      );
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
        <AnswerArray newQuestion={props.newQuestion} score={props.score} updateScore={props.changeScore} questionList={props.questionList}/>
      </View>
    );
  }
}

// The display of answers
// The wrong and write answers are taken from the api, and put into different buttons
// These buttons are added to an array, randomised and display
// Triggers phase change based on wether user choice was correct
function AnswerArray(props){
  const [phase, changePhase] = useState('phase1');  // Keeps track of what to display phase1(Answering) phase2(Answered Correctly) phase3(Answered Incorrectly)
  if(phase == 'phase1'){
    let answers = [<CorrectAnswer key="-1" changePhase={changePhase} score={props.score} updateScore={props.updateScore} answer={props.questionList[0].correct_answer} />];
    for(let  i = 0; i < props.questionList[0].incorrect_answers.length ; i++){
    answers.push(<WrongAnswer key= {i.toString()} changePhase={changePhase} answer={props.questionList[0].incorrect_answers[i]} />);
    }
    return(
      <View>
        {shuffleDeck(answers)}
      </View>
    );
  }
  else if(phase == 'phase2'){
    return(
      <RightAnswerView answer={props.questionList[0].correct_answer} newQuestion={props.newQuestion} changePhase={changePhase} />
    );
  }
  else{
    return(
      <WrongAnswerView answer={props.questionList[0].correct_answer} newQuestion={props.newQuestion} changePhase={changePhase} />
    );
  }
}

// Wrong answer button, triggers phase 3(wrong answer message), which shows error message
function WrongAnswer(props){
  return(
    <Pressable 
      onPress={() => {props.changePhase("phase3");}} 
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

// Right answer button, triggers phase 2 (right answer message), which shows error message
function CorrectAnswer(props){
  return(
    <Pressable 
      style={({pressed}) => pressed ?
      styles.pressed : styles.unpressed}
      onPress={() => {props.updateScore((parseInt(props.score)+1).toString()); props.changePhase("phase2");}}
    >
      <Text selectable={false}
            style={styles.titleStyle}>
              {decode(props.answer)}
      </Text>
    </Pressable>
  )
}

// Shuffles the deck of answers to random placements
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

// Tells the user that they answered incorrectly, changes back to phase 1(answering) and asks a new question
function WrongAnswerView(props){
  return(
    <View style={styles.WrongAnswer}>
    <Text style={styles.answerState}>Wrong! </Text>
    <Text style={styles.answerText}> The correct answer is {decode(props.answer)}!</Text>
    <Button 
          onPress={() => {props.newQuestion(); props.changePhase("phase1")}}
          title="OK"
          color="#808080"
          />
    </View>
  );
}

// Tells the user that they answered correctly, changes back to phase 1(answering) and asks a new question
function RightAnswerView(props){
  return(
    <View style={styles.RightAnswer}>
      <Text style={styles.answerState}>Right On! </Text>
      <Text style={styles.answerText}>{decode(props.answer)} is the correct answer</Text>
      <Button 
            onPress={() => {props.newQuestion(); props.changePhase("phase1")}}
            title="OK"
            color="#808080"
            />
    </View>
  );
}


/*******************************************************************************/
/*******************************************************************************/
                          // End Screen
                          // End Screen
/*******************************************************************************/
/*******************************************************************************/

// Screen that pops up when the user has hit, numQuestions(state) amount of questions
function EndScreen(props){
  return(
    <View style={styles.splashContainer}>
      <Text style={styles.scoreText}>SCORE: {props.score}</Text>
      <Button 
            onPress={() => {props.changeView("Splash")}}
            title="Back to start"
            color="#808080"
            />
    </View>
  );
}

const styles = StyleSheet.create({
  titleStyle:{
    color: 'white',
    fontSize: 18,
  },
  item: {
    backgroundColor: 'pink',
    color: "white",
    padding: 10,
    borderWidth: 2,
    margin: 10,
    fontSize: 18,
    height: 44,
    elevation: 30,
    justifyContent: 'center'
  },
  splashContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
    width: '100%',
    height: '100%'
  },
  WrongAnswer:{
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    width: '100%',
    height: '50%'
  },
  RightAnswer:{
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    width: '100%',
    height: '50%'
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
  },
  answerState:{
    marginBottom: 70,
    fontFamily: "Roboto",
    fontWeight: 'bold',
    color: 'black',
    fontSize: 24,
    textShadowColor: 'black'
  },
  answerText:{
    marginBottom: 30,
    fontFamily: "Roboto",
    color: 'black',
    fontSize: 20,
    textShadowColor: 'black'
  }
});

export default function AppWrapper(){
  const [view, changeView] = useState("Splash");
  return(
    <SafeAreaProvider>
      <ThemeProvider useDark={false}>
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