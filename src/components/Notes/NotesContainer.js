import React from "react";

const NoteContainer = (props) =>(
    <div className="notes-section">
        {props.children}
    </div>
);
export default NoteContainer