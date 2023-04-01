import React, { Component } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import { Utility } from "../../Utility/utils";
const theme = createTheme();

export class LoginAdmin extends Component {
  constructor(props) {
    super(props);
    this.LoginSubmit = this.LoginSubmit.bind(this);
    this.ChangeState = this.ChangeState.bind(this);
    this.utils = new Utility();
    this.state = {
      username: null,
      password: null,
      error: false,
      success: false,
    };
  }

  ChangeState(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  async LoginSubmit(ev) {
    ev.preventDefault();
    const username = this.state.username;
    const password = this.state.password;

    await fetch(this.utils.GetDomainBase() + "item/AdminLoginPortal", {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": "",
      },
      body: JSON.stringify({
        Username: username,
        Password: password,
      }),
    })
      .then((rsp) => rsp.json())
      .then((response) => {
        if (response.statusCode === 400) {
          this.setState({ error: true });
        } if (response.value === true) {
          this.setState({ success: true });
        }
        console.log(response);
      });
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Staff Login
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="username"
                name="username"
                autoComplete="username"
                onInput={this.ChangeState}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onInput={this.ChangeState}
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />

              <div style={{ display: this.state.error ? "block" : "none" }}>
                <Alert severity="error">User does not exists </Alert>
              </div>
              <div style={{ display: this.state.success ? "block" : "none" }}>
                <Alert variant="filled" severity="success">
                  Email as been sent to your registred email please check that out!
                </Alert>
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={this.LoginSubmit}
              >
                Continue
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}
