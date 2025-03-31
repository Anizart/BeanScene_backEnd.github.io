// Мокирую fetch:
global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: "Registration successful!" }),
    })
  );
  
  describe("User Registration", () => {
    beforeEach(() => {
      // Сброс значений формы перед каждым тестом
      document.body.innerHTML = `
        <form class="modal__wrapper">
          <input id="name" type="text" value="John Doe">
          <input id="email" type="email" value="john.doe@example.com">
          <input id="address" type="text" value="123 Main St">
          <input id="password" type="password" value="securepassword123">
          <button data-btn-signUp>Sign Up</button>
        </form>
      `;
    });
  
    it("should submit form data and show success message when registration is successful", async () => {
      // Мокирую функцию showMessage:
      const showMessage = jest.fn();
  
      // Мокирую клик по кнопке регистрации:
      document.querySelector('[data-btn-signUp]').addEventListener('click', async (e) => {
        e.preventDefault();
  
        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const address = document.querySelector('#address').value;
        const password = document.querySelector('#password').value;
  
        const data = { name, email, address, password };
  
        try {
          const response = await fetch('/regist', {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });
  
          const user = await response.json();
  
          if (response.ok) {
            showMessage(`${user.message} (～￣▽￣)～`);
          } else {
            showMessage(user.message);
          }
  
          document.querySelector('.modal__wrapper').reset();
        } catch (error) {
          console.error("Ошибка при отправке данных:", error);
          showMessage("Oops... Error during user registration <(＿ ＿)>");
        }
      });
  
      // Симулирую клик по кнопке регистрации:
      document.querySelector('[data-btn-signUp]').click();
  
      // Ожидаю, что showMessage будет вызван с успешным сообщением:
      expect(showMessage).toHaveBeenCalledWith("Registration successful! (～￣▽￣)～");
  
      // Проверяю, что fetch был вызван с нужными параметрами:
      expect(fetch).toHaveBeenCalledWith('/regist', expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "John Doe",
          email: "john.doe@example.com",
          address: "123 Main St",
          password: "securepassword123",
        }),
        headers: { "Content-Type": "application/json" },
      }));
    });
  
    it("should show error message if registration fails", async () => {
      // Мокирую ошибку при отправке данных:
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ message: "Email already in use." }),
        })
      );
  
      const showMessage = jest.fn();
  
      document.querySelector('[data-btn-signUp]').addEventListener('click', async (e) => {
        e.preventDefault();
  
        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const address = document.querySelector('#address').value;
        const password = document.querySelector('#password').value;
  
        const data = { name, email, address, password };
  
        try {
          const response = await fetch('/regist', {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });
  
          const user = await response.json();
  
          if (response.ok) {
            showMessage(`${user.message} (～￣▽￣)～`);
          } else {
            showMessage(user.message);
          }
  
          document.querySelector('.modal__wrapper').reset();
        } catch (error) {
          console.error("Ошибка при отправке данных:", error);
          showMessage("Oops... Error during user registration <(＿ ＿)>");
        }
      });
  
      // Симулирую клик по кнопке регистрации:
      document.querySelector('[data-btn-signUp]').click();
  
      // Проверяю, что при ошибке будет выведено соответствующее сообщение:
      expect(showMessage).toHaveBeenCalledWith("Email already in use.");
    });
  
    it("should handle errors during the request", async () => {
      // Мокирую ошибку при отправке запроса:
      global.fetch = jest.fn(() =>
        Promise.reject(new Error("Network Error"))
      );
  
      const showMessage = jest.fn();
  
      document.querySelector('[data-btn-signUp]').addEventListener('click', async (e) => {
        e.preventDefault();
  
        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const address = document.querySelector('#address').value;
        const password = document.querySelector('#password').value;
  
        const data = { name, email, address, password };
  
        try {
          const response = await fetch('/regist', {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });
  
          const user = await response.json();
  
          if (response.ok) {
            showMessage(`${user.message} (～￣▽￣)～`);
          } else {
            showMessage(user.message);
          }
  
          document.querySelector('.modal__wrapper').reset();
        } catch (error) {
          console.error("Ошибка при отправке данных:", error);
          showMessage("Oops... Error during user registration <(＿ ＿)>");
        }
      });
  
      // Симулирую клик по кнопке регистрации:
      document.querySelector('[data-btn-signUp]').click();
  
      // Проверяю, что при ошибке будет выведено сообщение об ошибке:
      expect(showMessage).toHaveBeenCalledWith("Oops... Error during user registration <(＿ ＿)>");
    });
  });