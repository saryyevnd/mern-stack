import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { useNavigate } from "react-router-dom";

const CreatePage = () => {
  const [link, setLink] = useState();
  const { request } = useHttp();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const pressHandler = async (e) => {
    if (e.key === "Enter") {
      try {
        let response = await request(
          "/api/link/generate",
          "POST",
          { from: link },
          { Authorization: `Bearer ${token}` }
        );

        navigate(`/detail/${response.link._id}`);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  return (
    <div className="row">
      <div className="col blue s12">
        <div className="input-field">
          <input
            className="yellow-input"
            placeholder="Enter link..."
            id="link"
            type="text"
            onChange={(e) => setLink(e.target.value)}
            onKeyUp={pressHandler}
          />

          <label htmlFor="link">Link</label>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
