import React, { Component } from "react";
import axios from "axios";
import Main from "../template/Main";

const headerProps = {
  icon: "video-camera",
  title: "Videos",
  subtitle: "Cadastro de videos: Incluir, Listar, Alterar e Excluir"
}

const baseUrl = "http://localhost:3001/videos";

const initialState = {
  video: { title: "", briefing: "", price: "", delivery_date: "", status: "", client_id: "" },
  list: []
}

export default class VideoCrud extends Component {

  state = { ...initialState }

  render() {
    return(
      <Main {...headerProps} />
    )
  }
}
