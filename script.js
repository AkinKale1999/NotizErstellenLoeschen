// Das "addBtn"-Element wird durch seine ID "add" aus dem Dokument geholt und einer Konstante zugewiesen.
const addBtn = document.getElementById("add");

// Die im lokalen Speicher gespeicherten Notizen werden als JSON-String abgerufen und in ein JavaScript-Objekt oder -Array umgewandelt.
const notes = JSON.parse(localStorage.getItem("notes"));

// Überprüfen, ob es gespeicherte Notizen gibt. Wenn ja, wird für jede Notiz die Funktion "addNewNote" aufgerufen.
if (notes) {
  notes.forEach((note) => addNewNote(note));
}

// Ein Event Listener wird dem "addBtn" hinzugefügt. Wenn auf den Button geklickt wird, wird eine neue Notiz ohne Text erstellt.
addBtn.addEventListener("click", () => addNewNote());

// Diese Funktion erstellt eine neue Notiz. Wenn kein Text übergeben wird, wird der Standardwert "" verwendet.
function addNewNote(text = "") {

    // Ein neues "div"-Element wird erstellt und der Klasse "note" zugewiesen.
  const note = document.createElement("div");
  note.classList.add("note");

  // Der HTML-Inhalt der Notiz wird definiert. Es enthält zwei Buttons (Bearbeiten und Löschen) und zwei Bereiche für den Text: 
  // "main" zeigt den formatierten Text an, während "textarea" für die Bearbeitung gedacht ist.
  note.innerHTML = `
      <div class="tools">
        <button class="edit"><i class="fas fa-edit"></i></button>
        <button class="delete"><i class="fas fa-trash-alt"></i></button>
      </div>

      <div class="main ${text ? "" : "hidden"}"></div>
      <textarea class="${text ? "hidden" : ""}"></textarea>
    `;

  // Hier werden die verschiedenen Elemente innerhalb der Notiz referenziert.
  const editBtn = note.querySelector(".edit");
  const deleteBtn = note.querySelector(".delete");
  const main = note.querySelector(".main");
  const textArea = note.querySelector("textarea");

  // Der übergebene Text (oder der Standardwert "") wird dem Textarea zugewiesen.
  textArea.value = text;
  // Der Text wird mit "marked" (vermutlich eine Markdown-Bibliothek) formatiert und im "main"-Div angezeigt.
  main.innerHTML = marked(text);

  // Ein Event Listener wird dem Löschen-Button hinzugefügt. Wenn darauf geklickt wird, wird die Notiz entfernt und die Liste der Notizen im lokalen Speicher aktualisiert.
  deleteBtn.addEventListener("click", () => {
    note.remove();
    updateLS(); // Die Liste der Notizen wird aktualisiert.
  });

  // Ein Event Listener für den Bearbeiten-Button wird hinzugefügt. Er schaltet zwischen der Anzeige und der Bearbeitung der Notiz um.
  editBtn.addEventListener("click", () => {
    main.classList.toggle("hidden"); // Versteckt oder zeigt den formatierten Text an.
    textArea.classList.toggle("hidden"); // Versteckt oder zeigt das Textarea an.
  });

  // Ein Event Listener für die Eingabe im Textarea wird hinzugefügt. 
  // Jedes Mal, wenn der Text geändert wird, wird der "main"-Div aktualisiert und die Liste der Notizen im lokalen Speicher aktualisiert.
  textArea.addEventListener("input", (e) => {
    const { value } = e.target; // Der aktuelle Wert des Textarea wird extrahiert.
    main.innerHTML = marked(value); // Der Text wird formatiert und im "main"-Div angezeigt.
    updateLS(); // Die Liste der Notizen wird aktualisiert.
  });

  // Die Notiz wird dem Dokumentenkörper hinzugefügt, sodass sie auf der Webseite angezeigt wird.
  document.body.appendChild(note);
}

// Diese Funktion aktualisiert die Liste der Notizen im lokalen Speicher.
function updateLS() {
  // Alle Textareas im Dokument werden gesammelt.
  const notesText = document.querySelectorAll("textarea");

  // Ein leeres Array, um die Inhalte der Textareas zu speichern.
  const notes = [];

  // Jeder Textarea-Inhalt wird in das Array "notes" gepusht.
  notesText.forEach((note) => notes.push(note.value));

  // Die Notizen werden als JSON-String im lokalen Speicher gespeichert.
  localStorage.setItem("notes", JSON.stringify(notes));
}