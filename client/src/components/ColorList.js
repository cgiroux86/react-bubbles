import React, { useState, useEffect } from "react";
import axios from "axios";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import { useHistory } from "react-router-dom";

const initialColor = {
  color: "",
  code: { hex: "" }
};

// useEffect(() => {});

const ColorList = ({ colors, updateColors }) => {
  const history = useHistory();
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [id, setId] = useState(Number);
  const [addColor, setAddColor] = useState({ color: "", code: { hex: "" } });

  console.log(colorToEdit, editing);

  const handleChanges = e => {
    setAddColor({ ...addColor, [e.target.name]: e.target.value });
    console.log(addColor);
  };

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
    console.log(colorToEdit);
  };

  const saveEdit = e => {
    e.preventDefault();
    axiosWithAuth()
      .put(`/api/colors/${id}`, colorToEdit)
      .then(res => {
        updateColors([res.data].concat(colors.filter(elem => elem.id !== id)));
        console.log(colors);
        setEditing(false);
        setColorToEdit(initialColor);
        history.push("/user");
      })
      .catch(err => console.log(err));
    // Make a put request to save your updated color
    // think about where will you get the id from...
    // where is is saved right now?
  };

  const deleteColor = color => {
    const found = color.id;
    axiosWithAuth()
      .delete(`/api/colors/${found}`)
      .then(() => {
        updateColors(colors.filter(elem => Number(elem.id) !== Number(found)));
      })

      .catch(err => console.log(err));
  };

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li
            id={color.id}
            key={Math.floor(Math.random() * 1000000)}
            onClick={() => {
              editColor(color);
              setId(color.id);

              // setColorToEdit(initialColor);
            }}
          >
            <span>
              <span
                className="delete"
                onClick={e => {
                  e.stopPropagation();
                  // setId(color.id);
                  deleteColor(color);
                }}
                // onMouseUp={e => {
                //   e.stopPropagation();
                //   deleteColor(id);
                // }}
              >
                x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <div className="spacer">
        <form>
          <input
            onChange={handleChanges}
            type="text"
            name="color"
            placeholder="color"
            value={addColor.color}
          ></input>
          <input
            onChange={e =>
              setAddColor({
                ...addColor,
                code: { hex: e.target.value }
              })
            }
            type="text"
            name="hex"
            placeholder="hex value"
            value={addColor.code.hex}
          ></input>
          <button
            onClick={e => {
              e.preventDefault();
              console.log(addColor);
              axiosWithAuth()
                .post("/api/colors", addColor)
                .then(res => {
                  updateColors(res.data);
                  console.log(res);
                  setAddColor({ color: "", code: { hex: "" } });
                })
                .catch(err => console.log(err));
            }}
          >
            Add Color
          </button>
        </form>
      </div>
    </div>
  );
};

export default ColorList;
