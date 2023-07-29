import React from "react";
import { useNavigate } from 'react-router-dom';

const CodeList = (props) =>{

    const navigate = useNavigate();
    
    const {codeBlockNames} = props;

    const onClickHandler = (codeBlockItem) =>{
        navigate(`/codeblock/${codeBlockItem}`);
    }

    return (//mapping the codeblock names to a list of buttons
        <div>
        <ul>
        {
            codeBlockNames.map((codeBlockItem , index)=> 
            <li key={index}>
                <button onClick={()=>onClickHandler(codeBlockItem)}>{codeBlockItem}</button>
            </li>
            
            )
        }
        </ul>
        </div>
    );

};

export default CodeList;