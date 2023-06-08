import React, { useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import { useEffect } from "react";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUerObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user) {
        setIsLoggedIn(true);
        setUerObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  }, [])
  const refreshUser = () => {
    const user = authService.currentUser;
    setUerObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };
  return (
    <>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={isLoggedIn} userObj={userObj} /> : "Initializing..."}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
