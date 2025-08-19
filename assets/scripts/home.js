document.getElementById("btn-login").addEventListener("click", () => {
  Popup.show({
    title: "Entrar",
    content: `<form>
                <label>Email: <input type="email"></label><br>
                <label>Senha: <input type="password"></label><br>
                <button type="submit">Login</button>
              </form>`,
    classes: ["popup-login"]
  });
});