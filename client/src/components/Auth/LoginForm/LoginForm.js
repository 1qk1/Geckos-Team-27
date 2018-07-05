import React from "react";
import Input from "../../UI/Input/Input";
import Button from "../../UI/ButtonIconText/ButtonIconText";

import "./LoginForm.css";

const loginForm = props => (
  <div className="LoginModal">
    <i className="fas fa-times LoginModal-Close" onClick={props.toggle} />
    <Button
      text="Log in using faceboooook"
      onClick={() => {
        console.log("xd");
      }}
      icon="fab fa-facebook"
      btnClass="Form-Button Button-Blue"
    />
    <Button
      text="Log in using gooooooooogle"
      onClick={() => {
        console.log("xd");
      }}
      icon="fab fa-google"
      btnClass="Form-Button Button-White"
    />
    <hr />
    <form action="/" method="POST">
      <Input name="email" placeholder="email address">
        <i className="fas fa-envelope-square Input-Icon" />
      </Input>
      <Input name="password" type="password" placeholder="Password">
        <i className="fas fa-lock Input-Icon" />
      </Input>
      <label className="GreenText">
        <input type="checkbox" name="savePassword" />
        Save Password
      </label>
      <Button
        text="Log in"
        onClick={() => {
          console.log("xd");
        }}
        btnClass="Form-Button Button-Red"
      />
    </form>
    <p className="text-centered">
      <a href="/forgot_password" className="GreenText">
        Forgot password?{" "}
      </a>
    </p>
    <hr />
    <p className="text-centered">
      No account? <a className="GreenText">Register</a>
    </p>
  </div>
);

export default loginForm;
