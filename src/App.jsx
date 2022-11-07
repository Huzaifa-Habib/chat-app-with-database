import {Routes, Route, Link} from "react-router-dom"
import Home from "./components/home"
import Login from "./components/login"
import Signup from "./components/signup"
import {useState, useEffect} from "react"
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc,getDocs,doc, onSnapshot,query, getDoc
        
      } 
 from "firebase/firestore"; 
 import {getAuth,onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword } from "firebase/auth"



 
const firebaseConfig = {
  apiKey: "AIzaSyDrxf1iRv6g8rdUERYv19tDxptmW9tqnTg",
  authDomain: "chat-app-with-database-fae34.firebaseapp.com",
  projectId: "chat-app-with-database-fae34",
  storageBucket: "chat-app-with-database-fae34.appspot.com",
  messagingSenderId: "738066714092",
  appId: "1:738066714092:web:d8f9b45960905706cc84c9",
  measurementId: "G-FSTEW5S5SV"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const auth = getAuth(app);





function App() {
  // const [usersData, setUsersData] = useState([])
  const [authData, setAuthData] = useState([]);
  const [isLogin, setIsLogin] = useState(true);


  useEffect(() => {
    let array = []


    const getData = async () => {
    const docRef = doc(db, "userInfo", "checkAuth");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      array.push(docSnap.data())
      setAuthData(array)
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }

    if(docSnap.data().boolean == false){
      setIsLogin(false)
    }
    else{
      setIsLogin(true)
    }


   }
   getData()


   }, [])

   console.log(isLogin)



  
  return(
    <div>
     { (isLogin == true) ?
      <div>
        

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login/>}/>
          <Route path="signup" element={<Signup/>}/>
          <Route path="*" element={<Login/>}/>



        </Routes>
        
    
      </div>
      :
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="signup" element={<Signup/>}/>
          <Route path="*" element={<Login/>}/>
        </Routes>
       



      </div>
      }

      {/* {(isLogin == false)?
       <Routes>
          <Route path="/" element={<Login />} />
          <Route path="signup" element={<Signup/>}/>
        </Routes>
        
        :
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login/>}/>
        <Route path="signup" element={<Signup/>}/>
        <Route path="*" element={<Login/>}/>



      </Routes>
      

        
        } */}


      
    </div>
  )

}

export default App;