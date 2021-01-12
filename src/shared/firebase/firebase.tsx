import React, { useState, createContext, useEffect } from 'react'
import { signInWithGoogle, auth } from './utils';
import firebase from "./utils"

interface User {
    id: string,
    name: string
}

export const UserContext = createContext({
    login: () => { },
    logout: () => { },
    id: "",
    email: "",
    name: "",
    photoURL: "",
    isLogged: false,
});

const UserProvider = (props:any) => {
    const [isLogged, setIsLogged] = useState(false);
    const ref = firebase.database().ref('Users');
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user !== null) {
                setCurrentUser(user)
            }
            return () => logoutUser();
        });

        const usersArray: User[] = [];
        ref.on("value", (snap) => {
            const snapshot = snap.val();
            for (let id in snapshot) {
                usersArray.push({
                    id: snapshot[id].id,
                    name: snapshot[id].displayName
                })
            }
        })
        setUsers(usersArray);
    }, [isLogged, currentUser])

    const validateUser = (array: User[], id: string) => {
        for (let i = 0; i < array.length; i++) {
            if (array[i].id === id) return false;
        }
        return true;
    }

    const addUser = (ref: firebase.database.Reference, id: string, name: string) => {
        ref.push({ id: id, name: name });
    }

    const login = () => signInWithGoogle().then((u) => {
        if (validateUser(users, u.user.uid)) {
            addUser(ref, u.user.uid, u.user.displayName);
        }
        setIsLogged(true);
    }).then(() => {});

    const logoutUser = () => {
        auth.signOut();
        setIsLogged(false);
    }

    const data = {
        login: login,
        logout: logoutUser,
        id: currentUser ? currentUser.uid : "",
        email: currentUser ? currentUser.emial : "",
        name: currentUser ? currentUser.displayName : "",
        photoURL: currentUser ? currentUser.photoURL : "",
        isLogged: isLogged,
    };

    return (
        <UserContext.Provider value={data}>
            {props.children}
        </UserContext.Provider>
    )
}
export default UserProvider;