import Nweet from "components/Nweet";
import { dbService } from "fbase";
import { addDoc, collection, query, onSnapshot, orderBy } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    /*
    const getNweets = async () => {
        
        /*
        const q = query(collection(dbService, "nweets"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const nweetObj = {
                ...doc.data(),
                id: doc.id,
            }
        setNweets(prev => [nweetObj, ...prev]);
        });
        */
    /*
        const dbNweets = await getDocs(collection(dbService, "nweets"));
        dbNweets.forEach((document) => {
            const nweetObj = {
                ...document.data(),
                id: document.id,
            }
        setNweets(prev => [nweetObj, ...prev]);
        });
    };
    useEffect(() => {
        getNweets();
    }, [])
    */
   useEffect(() => {
    const q = query(
        collection(dbService, "nweets"),
    );
    onSnapshot(q, (snapshot) => {
        const nweetArray = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setNweets(nweetArray);
    });
   }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        await addDoc(collection(dbService, "nweets"),{
            text: nweet,
            ceatedAt: Date.now(),
            creatorId: userObj.uid,
        });
        setNweet("");
    };
    const onChange = (event) => {
        const { target: {value} } = event;
        setNweet(value);
    };
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
                <input type="submit" value="Nweet"/>
            </form>
            <div>
                {nweets.map((nweet) => 
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
                )}
            </div>
        </div>
    );
};
export default Home;