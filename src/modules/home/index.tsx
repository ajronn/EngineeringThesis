import React, {useContext} from "react";
import {Protected, Unprotected} from "shared/guard"
import {UserContext} from "shared/firebase"
import { Link } from "react-router-dom";

import {Button} from "ui";

import Castle from "../../ui/images/castle.png";

import csx from "./style.scss"

export const Home = () => {
    const ctx = useContext(UserContext);

    return (
        <>
            <div className={csx.home}>
                <div className={csx.content}>
                    <div>
                        <h1>Monument</h1>
                        <p>
                            Are you in the new neighborhood? 
                            You have nothing to do with yourself? 
                            Are you bored? 
                            Do you want to spend your time in an interesting way? 
                            Monument is an application thanks to which you will find your favorite place on Earth.
                        </p>
                    <Protected>
                        <div className={csx.unprotectedText} >
                            <p>
                                I see you already have an account... so start your adventure!
                            </p>
                            <div className={csx.centered} >
                                <Link to='/map' ><Button onClick={()=>{}} variant='large' >Let's go!</Button></Link>
                            </div>
                        </div>
                    </Protected>
                    <Unprotected>
                        <div className={csx.unprotectedText} >
                            <p>
                                First time on our site? Log in and your account will be created automatically!
                            </p>
                            <div className={csx.centered} >
                                <Button onClick={ctx.login} variant='large' >Login</Button>
                            </div>
                        </div>
                    </Unprotected>
                    </div>
                </div>
                <div className={csx.graphic}>
                    <img src={Castle}/>
                </div>
            </div>
        </>

    )
}