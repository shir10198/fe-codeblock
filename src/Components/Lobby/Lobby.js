import React from "react"; 
import CodeList from "../CodeList/CodeList";

const Lobby = (props) => {
    return (
    <div>
        <h1>Lobby Page</h1>
        <h2>Choose code block:</h2>
        <CodeList codeBlockNames={props.codeBlockNames}/>
       
    </div>
    );
};

export default Lobby;