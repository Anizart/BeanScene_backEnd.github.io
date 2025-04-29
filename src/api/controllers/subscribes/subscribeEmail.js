import Subscribe from "../../models/subscribe.js"
import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config() // Загрузка переменных окружения

//+ Эндпоинт для добавления email в таблицу Subscribe
export const subscribeEmail = async (req, res) => {
  try {
    const { email } = req.body

    // Проверяю, что email был передан:
    if (!email) {
      return res.status(400).json({ message: "Требуется электронная почта" })
    }

    // Проверяю, существует ли уже такой email в базе:
    const existingEmail = await Subscribe.findOne({ where: { email } })
    if (existingEmail) {
      return res.status(400).json({ message: "Эта почта занята" })
    }

    // Добавляю email:
    const newSubscription = await Subscribe.create({ email })
    console.log("New subscriber:", newSubscription.toJSON())

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: "coffeehousebeanscene@gmail.com",
      to: email,
      subject: "Вы подписаны!",
      html: `
        <div style="background-color:#fdf6f0;padding:20px;font-family:Arial,sans-serif;color:#4e342e;">
          <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
            <img src="https://thumb.ac-illust.com/50/501e086f2a0397592f45bb2645c3ed3e_t.jpeg" alt="Coffee Banner" style="width:100%;height:auto;" />
            <div style="padding:30px;">
              <h2 style="margin-top:0;color:#6f4e37;">Спасибо, что с нами!</h2>
              <p style="font-size:16px;line-height:1.5;">
                Добро пожаловать в <strong>Bean Scene</strong> — уютный уголок для любителей кофе ☕.
                Мы рады, что вы подписались. Впереди — новости, акции и тепло нашего сердца.
              </p>
              <p style="font-size:16px;margin-top:30px;">
                До скорых встреч, <br/>
                <em>Команда Bean Scene</em>
              </p>
            </div>
          </div>
        </div>
      `,
    })

    res
      .status(201)
      .json({ message: "Вы подписаны", subscriber: newSubscription })
  } catch (error) {
    console.error("Ошибка во время подписки:", error)
    res.status(500).json({ message: "Внутренняя ошибка сервера" })
  }
}
