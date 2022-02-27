import React, { Component } from "react";
import axios from "axios";
import Main from "../template/Main";

const headerProps = {
  icon: "video-camera",
  title: "Videos",
  subtitle: "Cadastro de videos: Incluir, Listar, Alterar e Excluir"
}

const baseUrl = "http://localhost:3001/videos";
const clientsUrl = 'http://localhost:3001/clients';

const initialState = {
  video: { title: "", briefing: "", price: "", delivery_date: "", status: "Pendente", client_id: "" },
  list: []
}

export default class VideoCrud extends Component {

  state = { ...initialState }

  componentWillMount(){
    axios(baseUrl).then(resp => {
      this.setState({ list: resp.data })
    })
    // Consulta ao backend para saber se há pelo menos um cliente cadastrado 
    axios(clientsUrl).then(resp => {
      console.log(Object.keys(resp.data).length);
    })
  }


  clear() {
    this.setState( { video: initialState.video} )
  }

  save() {
    const video = this.state.video;
    const method = video.id ? 'put' : 'post';
    const url = video.id ? `${baseUrl}/${video.id}` : baseUrl ;
    axios[method](url, video)
      .then(resp => {
        const list = this.getUpdatedList(resp.data);
        this.setState({video: initialState.video, list});
      })
  }

  getUpdatedList(video) {
    const list = this.state.list.filter(v => v.id !== video.id);
    list.unshift(video);
    return list;
  }

  updateField(event) {
    const video = { ...this.state.video }
    video[event.target.name] = event.target.value;
    this.setState({ video });
  }

  // TODO: status e client_id
  renderForm() {
    return(
      <div className="form">
        <div className="row">          
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label><b>Título</b></label>
              <input type="text" className="form-control"
                name="title"
                value={this.state.video.title}
                onChange={e => this.updateField(e)}
                placeholder="Digite o título:" />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label><b>Briefing</b></label>
              <input type="text" className="form-control"
                name="briefing"
                value={this.state.video.briefing}
                onChange={e => this.updateField(e)}
                placeholder="Digite o Briefing:" />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label><b>Preço</b></label>
              <input type="text" className="form-control"
                name="price"
                value={this.state.video.price}
                onChange={e => this.updateField(e)}
                placeholder="Digite o preço:" />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label><b>Data de Entrega</b></label>
              <input type="text" className="form-control"
                name="delivery_date"
                value={this.state.video.delivery_date}
                onChange={e => this.updateField(e)}
                placeholder="Digite a data de entrega:" />
            </div>
          </div>            
        </div>

        <hr />
        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-primary"
              onClick={e => this.save(e)}>
              Salvar
            </button>

            <button className="btn btn-secondary ml-2"
              onClick={e => this.clear(e)}>
              Cancelar
            </button>
          </div>
        </div>

      </div>
    )
  }

  render() {
    return(
      <Main {...headerProps} >
        {this.renderForm()}
      </Main>
    )
  }
}
