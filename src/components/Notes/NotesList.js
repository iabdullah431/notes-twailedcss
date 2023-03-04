import React from "react";

const notesList = (props) =>(
    <ul className="notes-list">
        {props.children}
    </ul>
);
export default notesList;