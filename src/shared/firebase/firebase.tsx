import React, { useState, createContext, useEffect } from 'react'
import { signInWithGoogle, auth } from './utils';
import firebase from "./utils"

interface User {
    id: string,
    name: string
}

type FavMonument = {
    id: string,
    name: string,
    fun: string,
    address: string,
    town: string,
}

export const UserContext = createContext({
    login: () => { },
    logout: () => { },
    addMonumentToFav: (monumentId: string, name: string, fun: string, town: string, address: string) => { },
    removeFromFav: (id: string) => { },
    loadFavourites: () => { },
    shareMonuments: () => { },
    loadFavMonuments: (url: string) => { },
    currentFavMonument: {monuments: [], user: ""},
    id: "",
    email: "",
    name: "",
    photoURL: "",
    favourites: [],
    isLogged: false,
    monumentRef: firebase.database().ref('Fav')
});

const UserProvider = (props: any) => {
    const [isLogged, setIsLogged] = useState(false);
    const ref = firebase.database().ref('Users');
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [favourites, setFavourites] = useState<any[]>([]);
    const [currentFavMonument, setCurrentFavMonument] = useState<{monuments: FavMonument[], user: string}>({monuments: [], user: ""});

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

    useEffect(() => {
        loadFavourites();
    }, [currentUser])

    const validateUser = (array: User[], id: string) => {
        for (let i = 0; i < array.length; i++) {
            if (array[i].id === id) return false;
        }
        return true;
    }

    const removeFromFav = (monumentId: string) => {
        let myId = '';
        firebase.database().ref('Fav').on("value", (snap) => {
            const snapshot = snap.val();
            for (let id in snapshot) {
                if (snapshot[id].id === monumentId && snapshot[id].user === currentUser.uid)
                    myId = id;
            }
        })
        firebase.database().ref('Fav').child(myId).remove();
    }

    const loadFavMonuments = (url: string) => {
        let array: FavMonument[] = [];
        let monuments = [];
        let u = "";
        firebase.database().ref('Share').on("value", (snap) => {
            const snapshot = snap.val();
            for (let id in snapshot) {
                if (id === url) {
                    u = snapshot[id].userName;
                    for (let item in snapshot[id].monuments) {
                        array.push({
                            id: snapshot[id].monuments[item].id,
                            name: snapshot[id].monuments[item].name,
                            fun: snapshot[id].monuments[item].fun,
                            address: snapshot[id].monuments[item].address,
                            town: snapshot[id].monuments[item].town
                        })
                    }
                }
            }
        })

        setCurrentFavMonument({monuments: array, user: u});
    }

    const loadFavourites = () => {
        const array: any[] = [];
        firebase.database().ref('Fav').on("value", (snap) => {
            const snapshot = snap.val();
            for (let id in snapshot) {
                if (snapshot[id].user === currentUser.uid)
                    array.push({ id: snapshot[id].id, name: snapshot[id].name, fun: snapshot[id].fun, town: snapshot[id].town, address: snapshot[id].address });
            }
        })
        setFavourites(array);
    }

    const addMonumentToFav = (monumentId: string, name: string, fun: string, town: string, address: string) => {
        firebase.database().ref('Fav').push({ id: monumentId, user: currentUser.uid, name: name, town: town, fun: fun, address: address });
    }

    const addUser = (ref: firebase.database.Reference, id: string, name: string) => {
        ref.push({ id: id, name: name });
    }

    const login = () => signInWithGoogle().then((u) => {
        if (validateUser(users, u.user.uid)) {
            addUser(ref, u.user.uid, u.user.displayName);
        }
        setIsLogged(true);
    }).then(() => { });

    const logoutUser = () => {
        auth.signOut();
        setIsLogged(false);
    }

    const shareMonuments = () => {
        let myId = '';
        let url = '';
        firebase.database().ref('Share').on("value", (snap) => {
            const snapshot = snap.val();
            for (let id in snapshot) {
                if (snapshot[id].user === currentUser.uid) {
                    myId = id;
                }

            }
        })
        if (myId !== '') firebase.database().ref('Share').child(myId).remove();
        firebase.database().ref('Share').push({ user: currentUser.uid, userName: currentUser.displayName , monuments: favourites });

        firebase.database().ref('Share').on("value", (snap) => {
            const snapshot = snap.val();
            for (let id in snapshot) {
                if (snapshot[id].user === currentUser.uid) {
                    url = id;
                }

            }
        })

        if(url !== ''){
            const currentUrl = window.location.href.replace(window.location.pathname, '/share/')+url;
            const el = document.createElement('textarea');
            el.value = currentUrl;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            alert("Url "+currentUrl+" was copied!");
        }
    }

    const data = {
        login: login,
        logout: logoutUser,
        addMonumentToFav: addMonumentToFav,
        removeFromFav: removeFromFav,
        loadFavourites: loadFavourites,
        shareMonuments: shareMonuments,
        loadFavMonuments: loadFavMonuments,
        currentFavMonument: currentFavMonument,
        id: currentUser ? currentUser.uid : "",
        email: currentUser ? currentUser.emial : "",
        name: currentUser ? currentUser.displayName : "",
        photoURL: currentUser ? currentUser.photoURL : "",
        favourites: favourites,
        isLogged: isLogged,
        monumentRef: firebase.database().ref('Fav')
    };

    return (
        <UserContext.Provider value={data}>
            {props.children}
        </UserContext.Provider>
    )
}
export default UserProvider;

