import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "@firebase/firestore";

export default ({ refreshUser, userObj }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.newDisplayName);
    const navigate = useNavigate();
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    };
    const getMyNweets = async () => {
        const q = query(
            collection(dbService, "nweets"),
            where("creatorId", "==", userObj.uid)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    };
    useEffect(() => {
        getMyNweets();
    }, []);
    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewDisplayName(value);
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.newDisplayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName: newDisplayName,
            });
            refreshUser();
        }
    };
    return (
        <>
            <form onSubmit={onSubmit} >
                <input value={newDisplayName} onChange={onChange} type="text" placeholder="Display Name" />
                <input type="submit" value="Update Profile" />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};