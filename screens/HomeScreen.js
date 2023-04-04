import { useNavigation } from '@react-navigation/core'
import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, TextInput, Keyboard, ScrollView, Button  } from 'react-native'
import { auth } from '../firebase'
import Task from './Task' 
import { firestore } from '../firebase'
import { collection, setDoc } from 'firebase/firestore';
import { doc, getDoc } from "firebase/firestore";
import calendar from '../Service/calendar'


const HomeScreen = () => {
  const navigation = useNavigation()
  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);
  const user = auth.currentUser;

  const handleAddTask = async () => {
    Keyboard.dismiss();
    if(!task) return;
    setTaskItems([...taskItems, task])
    const userRef = doc(collection(firestore, 'todolist'), user.uid);
    await setDoc(userRef, {
      tasks: [...taskItems, task]
    })
    setTask(null);
  }

  const handleTest = async () => {
    try {
      const token =  await calendar.getToken('19120693','0932001Pr@');
      console.log('token: ', token);
      const events = await calendar.getCalendarData(token, 12, 2022);
      console.log('events: ', events);
    } catch (error) {
      
    }
  }

  useEffect(() => {
    async function fetchData(){
      const docRef = doc(firestore, "todolist", user.uid);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        const jsonObject = docSnap.data();
        const tasks = jsonObject.tasks;
        console.log("tasks:", tasks);
        setTaskItems(tasks)
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    fetchData();
  },[])

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy)
  }

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }

  return (
    <View style={styles.container}>
      {/* --------------------------------------------------------------------------------------- */} 
      <Text>Email: {user.email}</Text>
      <TouchableOpacity
        onPress={handleSignOut}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
      {/* --------------------------------------------------------------------------------------- */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1
        }}
        keyboardShouldPersistTaps='handled'
      >
      {/* Today's Tasks */}
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Today's tasks</Text>
        <View style={styles.items}>
          {/* This is where the tasks will go! */}
          {
            taskItems.map((item, index) => {
              return (
                <TouchableOpacity key={index}  onPress={() => completeTask(index)}>
                  <Task text={item} /> 
                </TouchableOpacity>
              )
            })
          }
        </View>
      </View> 
      </ScrollView>
      {/* --------------------------------------------------------------------------------------- */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput style={styles.input} placeholder={'Write a task'} value={task} onChangeText={text => setTask(text)} />
        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
        <Button
          onPress={handleTest}
          title="+"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </KeyboardAvoidingView>

    </View>
    
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
   button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {},
})