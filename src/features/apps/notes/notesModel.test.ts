import { describe, expect, it } from "vitest";
import {
  DEFAULT_NOTES_FOLDER_ID,
  createDefaultNotesFolder,
  filterNotes,
  getNotePreview,
  getNoteTitle,
  sortNoteFolders,
  type Note,
} from "./notesModel";

const sampleNotes: Note[] = [
  {
    id: "note-1",
    title: "Pasta plan",
    body: "Tomatoes and basil for dinner",
    folderId: DEFAULT_NOTES_FOLDER_ID,
    createdAt: "2026-04-11T10:00:00.000Z",
    updatedAt: "2026-04-11T10:00:00.000Z",
  },
  {
    id: "note-2",
    title: "Standup",
    body: "Share launch progress with the team",
    folderId: "folder-work",
    createdAt: "2026-04-11T11:00:00.000Z",
    updatedAt: "2026-04-11T11:00:00.000Z",
  },
];

describe("notesModel", () => {
  it("filters notes by title and body text", () => {
    // Arrange
    const query = "basil dinner";

    // Act
    const result = filterNotes(sampleNotes, {
      query,
      maybeFolderId: null,
    });

    // Assert
    expect(result.map((note) => note.id)).toEqual([
      "note-1",
    ]);
  });

  it("applies folder filtering before returning notes", () => {
    // Arrange
    const maybeFolderId = "folder-work";

    // Act
    const result = filterNotes(sampleNotes, {
      query: "",
      maybeFolderId,
    });

    // Assert
    expect(result.map((note) => note.id)).toEqual([
      "note-2",
    ]);
  });

  it("keeps the default folder first and sorts others by name", () => {
    // Arrange
    const folders = [
      {
        id: "folder-z",
        name: "Zebra",
        createdAt: "2026-04-11T11:00:00.000Z",
        updatedAt: "2026-04-11T11:00:00.000Z",
      },
      {
        id: "folder-a",
        name: "Alpha",
        createdAt: "2026-04-11T12:00:00.000Z",
        updatedAt: "2026-04-11T12:00:00.000Z",
      },
      createDefaultNotesFolder(),
    ];

    // Act
    const result = sortNoteFolders(folders);

    // Assert
    expect(result.map((folder) => folder.id)).toEqual([
      DEFAULT_NOTES_FOLDER_ID,
      "folder-a",
      "folder-z",
    ]);
  });

  it("formats note titles and previews for list rendering", () => {
    // Arrange
    const untitledNote: Note = {
      id: "note-3",
      title: "   ",
      body: "  \nDeep work block\n  ",
      folderId: DEFAULT_NOTES_FOLDER_ID,
      createdAt: "2026-04-11T11:30:00.000Z",
      updatedAt: "2026-04-11T11:30:00.000Z",
    };

    // Act
    const title = getNoteTitle(untitledNote);
    const preview = getNotePreview(untitledNote);

    // Assert
    expect(title).toBe("Untitled");
    expect(preview).toBe("Deep work block");
  });
});
