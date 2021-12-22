import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  // const [formIsValid, setFormIsValid] = useState(false);

  //using the useEffect() on every key stroke is not too bad for filling forms but it is bad  if we want to send an http request we don't need to send it on every key stroke it will cause network traffic so we use timeouts and cleean-ups.

  // useEffect(() => {
  //   const identifier = setTimeout(() => {
  //     console.log("Checking form validity");
  //     setFormIsValid(
  //       enteredEmail.includes("@") && enteredPassword.trim().length > 6
  //     );
  //   }, 5000);

  //   Clean-up
  //   return () => {
  //     console.log("CleanUp");
  //     clearTimeout(identifier);
  //   };
  // }, [enteredEmail, enteredPassword]);

  // const emailChangeHandler = (event) => {
  //   setEnteredEmail(event.target.value);

  //   setFormIsValid(
  //     e.target.value.includes("@") && enteredPassword.trim().length > 6
  //   );
  // };

  // const passwordChangeHandler = (event) => {
  //   setEnteredPassword(event.target.value);

  //   setFormIsValid(
  //     e.target.value.trim().length > 6 && enteredEmail.includes("@")
  //   );
  // };

  // const validateEmailHandler = () => {
  //   setEmailIsValid(enteredEmail.includes("@"));
  // };

  // const validatePasswordHandler = () => {
  //   setPasswordIsValid(enteredPassword.trim().length > 6);
  // };

  // const submitHandler = (event) => {
  //   event.preventDefault();
  //   props.onLogin(enteredEmail, enteredPassword);
  // };

  ///////////////////////////////////////////////////////
  //We use useReducer() when we have state that call another but you can not use the previous state because it won't work for the code like setFormIsValid(
  //   e.target.value.includes("@") && enteredPassword.trim().length > 6
  // );
  //setFormIsValid is calling another state enteredPassword without using the previous state function
  //We can also use it to combine our email and password state with their validity state.
  //Syntax -const [state, dispatchFn] = useReducer(reducerFn, initialState, initialFn );

  const emailReducer = (state, action) => {
    if (action.type === "User_Input") {
      return { value: action.value, isValid: action.value.includes("@") };
    }

    if (action.type === "User_Blur") {
      return { value: state.value, isValid: state.value.includes("@") };
    }

    return { value: "", isValid: false };
  };

  const passwordReducer = (state, action) => {
    if (action.type === "User_Pass") {
      return { value: action.value, isValid: action.value.trim().length > 6 };
    }

    if (action.type === "User_Blur") {
      return { value: state.value, isValid: state.value.trim().length > 6 };
    }

    return { value: "", isValid: false };
  };

  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("Checking form validity");
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 2000);

    //Clean - up;
    return () => {
      console.log("CleanUp");
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "User_Input", value: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "User_Pass", value: event.target.value });
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "User_Blur" });
  };

  const validatePasswordHandler = () => {
    dispatchEmail({ type: "User_Blur" });
  };

  const emailInputRef = useRef();

  const passwordInputRef = useRef();

  const ctx = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();

    if (formIsValid) {
      ctx.onLogin(emailState.value, passwordState.value);
    } else if (!emailIsValid) {
      emailInputRef.current.focus();
    } else {
      passwordInputRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          label="E-Mail"
          isValid={emailState.isValid}
          type="email"
          id="email"
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />

        <Input
          ref={passwordInputRef}
          label="Password"
          isValid={passwordState.isValid}
          type="password"
          id="password"
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />

        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>

        {/* <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div> */}
      </form>
    </Card>
  );
};

export default Login;
