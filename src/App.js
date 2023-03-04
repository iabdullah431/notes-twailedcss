import React, {useEffect, useState} from 'react';
import './App.css';
import Preview from './components/Preview';
import Message from './components/Message';
import NoteContainer from './components/Notes/NotesContainer';
import NotesList from './components/Notes/NotesList';
import Note from './components/Notes/Note';
import NoteForm from './components/Notes/NoteForm';
import Alert from './components/Alert';

function App() {

  const [notes,setNotes]= useState([]);
  const [title,setTitle]= useState('');
  const [content,setContent]= useState('');
  const [selectedNote,setSelectedNote]= useState(null);
  const [creating,setCreating]= useState(false);
  const [editing,setEditing]= useState(false);
  const [validationErrors, setValidationErrors] = useState([]);


  // حفظ الملفات في ذاكره المتصفح
  useEffect (() => {
    if (localStorage.getItem('notes')){
      setNotes(JSON.parse(localStorage.getItem('notes')));
    }else{
      localStorage.setItem('notes',JSON.stringify([]));
    }
  },[]);

  // التحقق
  useEffect(() =>{
    if(validationErrors.length !== 0){
      setTimeout(() =>{
        setValidationErrors([]);
      }, 2000)
    }
  },[validationErrors])

  // تعريف امر الحفظ بالمتصفح
  const saveTolocalStrotage = (key, value) => {
    localStorage.setItem (key, JSON.stringify(value));
  }

  // التحقق
  const validate = () => {
    const validationErrors = [];
    let passed = true;
    if(!title){
      validationErrors.push("الرجاء كتابة عنوان الملاحظة");
      passed = false
    }
    if(!content) {
      validationErrors.push("الرجاء كتابة محتوى الملاحظة");
      passed = false
    }
    setValidationErrors(validationErrors);
    return passed;
  }

  // تغير عنوان الملاحظة

  const changeTitleHandler = (event) =>{
    setTitle(event.target.value);
  }
 
  // تغير محتوى الملاحظة
  const changeContentHandler = (event) =>{
    setContent(event.target.value);
  }

  // حفظ الملاحظه
  const saveNoteHandler = () =>{

    if(!validate()) return;

    const note ={
      id: new Date(),
      title: title,
      content: content
    }
    // تحديث الملاحظه
    const updateNotes = [...notes, note];
    
    saveTolocalStrotage('notes',updateNotes);
    setNotes(updateNotes);
    setCreating(false);
    setSelectedNote(note.id);
    setTitle('');
    setContent('');
  }

  // إختيار الملاحظة
  const selectNoteHandler = noteId => {
    setSelectedNote(noteId);
    setCreating(false);
    setEditing(false);
  }

  // الانتقال الى وضع تعديل الملاحطة
  const editNoteHandler =() => {
    const note = notes.find(note => note.id === selectedNote);
    setEditing(true);
    setTitle(note.title);
    setContent(note.content);
  }
  // التعديل على الملاحظة
  const updateNoteHandler = () => {
    if(!validate()) return;
    const updateNotes = [...notes];
    const noteIndex = notes.findIndex(note => note.id === selectedNote);
    updateNotes[noteIndex] ={
      id: selectedNote,
      title: title,
      content: content
    };
    saveTolocalStrotage('notes',updateNotes);
    setNotes (updateNotes);
    setEditing(false);
    setTitle('');
    setContent('');
  }

  // الانتقال الى صفحة إضافة ملاحظة 
  const addNoteHandler = () =>{
    setCreating(true);
    setEditing(false);
    setTitle('');
    setContent('');
  }

  // حذف ملاحظة
  const deleteNoteHandler = () => {
    const updateNotes = [...notes];
    const noteIndex = updateNotes.findIndex(note => note.id === selectedNote);
    notes.splice(noteIndex, 1);
    saveTolocalStrotage('notes',updateNotes);
    setNotes(notes);
    setSelectedNote(null);
  }

  const getAddNote = () => {
    return (
      <NoteForm
      fromTitle="ملاحظة جديدة"
      title={title}
      content={content}
      titleChanged={changeTitleHandler}
      contentChanged={changeContentHandler}
      submitText="حفظ"
      submitClicked={saveNoteHandler}
      />
    );
  };

  const getPreview = () => {

    if(notes.length === 0){
      return <Message title="لم تقم بكتابة أي ملاحطة  " />
    }

    if (!selectedNote){
      return <Message title="الرجاء إختيار ملاحظة" />
    }
    
    const note = notes.find(note => {
      return note.id === selectedNote;
    });

    let noteDisplay =(
      <div>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
      </div>
    )

    if(editing){
      noteDisplay =(
        <NoteForm
      fromTitle="تعديل الملاحظة"
      title={title}
      content={content}
      titleChanged={changeTitleHandler}
      contentChanged={changeContentHandler}
      submitText="تعديل"
      submitClicked={updateNoteHandler}
      />
      );
    }
    return (
      <div>
        {!editing &&
        <div className="note-operations text-xl text-gray-500 justify-between">
        <a href="#" onClick={editNoteHandler}>
          <i className="fa fa-pencil-alt" />
        </a>
        <a href="#" onClick={deleteNoteHandler}>
          <i className="fa fa-trash" />
        </a>
      </div>
        }
        
        {noteDisplay}
        </div>
    );
  };


  return (
    <div className="App">
      <NoteContainer>
        <NotesList>
          {notes.map(note =>
          <Note
           key={note.id}
            title={note.title}
            noteClicked={() => selectNoteHandler(note.id)}
             active={selectedNote ===note.id}
             />
          )}
        </NotesList>
        <button className=" add-btn bg-red-700 text-red-50 absolute ml-22 h-11 w-11  rounded-lg md:text-center leading-8 text-lg pb-1 px-4" onClick={addNoteHandler}>+</button>
      </NoteContainer>
      <Preview>
      {creating ? getAddNote() : getPreview()}
      </Preview>
      {validationErrors.length !== 0 && <Alert validationMessages={validationErrors} />}
    </div>
  );
}

export default App;
