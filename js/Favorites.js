import { GitHubUser } from "./GithubUser.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load () {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }

  save () {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }

  async add (username) {
    try {

      const userExists = this.entries.find(entry => entry.login === username);
      
      if (userExists) {
        throw new Error("Usuário já cadastrado à lista!");
      }

      const user = await GitHubUser.search(username);
      
      if (user.login === undefined) {
        throw new Error("Usuário não encontrado!");
      }

      this.entries = [...this.entries, user];
      this.update();
      this.save();

    } catch (error) {
      alert(error.message);
      return;
    }
    
  }

  delete (user) {
    const entriesFiltered = this.entries.filter(entry => entry.login!== user.login);
    this.entries = entriesFiltered;
    this.update();
    this.save();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody");

    this.update();
    this.onAdd();
  }

  onAdd() {
    const addButton = this.root.querySelector('.search button');
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input');
      this.add(value);
    }
  }

  update() {
    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.createRow();
      row.querySelector(".user img").src = `https://github.com/${user.login}.png`;
      row.querySelector(".user img").alt = `Imagem do ${user.name}`;
      row.querySelector(".user a").href = `https://github.com/${user.login}`;
      row.querySelector(".user a p").textContent = user.name;
      row.querySelector(".user a span").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;

      row.querySelector(".remove").addEventListener("click", () => {
        const isOk = confirm("Tem certeza que deseja deletar essa linha ?");
        if (isOk) {
          this.delete(user);
        }
      });

      this.tbody.append(row);
    });
  }

  createRow () {
    const tr = document.createElement('tr');
    tr.innerHTML = `
          <td class="user">
            <img src="https://github.com/login.png" alt="Imagem do usuário">
            <a href="" target="_blank">
              <p>Name</p>
              <span>login</span>
            </a>
          </td>
          <td class="repositories"></td>
          <td class="followers"></td>
          <td>
            <button class="remove">&times;</button>
          </td>
    `
    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr")
      .forEach(tr => tr.remove());
  }
}
 
//continuar da aula 1075
