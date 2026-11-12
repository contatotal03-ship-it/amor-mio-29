/**
 * ============================================================================
 * BANCO CREATIVO DE 30 DÍAS ESCALABLES ("MEJOR CADA DÍA") + PLANES ALTERNATIVOS
 * Cada Trivia y Elección incluye un mensaje distinto en pantalla por opción.
 * ============================================================================
 */

export const DYNAMIC_TYPES = {
  classic: { label: 'Carta & Recuerdo', icon: '💌', desc: 'Mensaje íntimo, fotos, video o nota de voz.' },
  scratch: { label: 'Raspa y Gana Dorado', icon: '🪙', desc: 'Tarjeta metálica dorada que raspa con su dedo para revelar el premio.' },
  trivia: { label: 'Trivia de Nosotros', icon: '🧠', desc: 'Pregunta romántica con respuesta única en pantalla para cada opción.' },
  clue: { label: 'Búsqueda del Tesoro', icon: '🕵️‍♀️', desc: 'Acertijo o pista física + palabra clave secreta para abrir el regalo.' },
  coupon: { label: 'Cupón VIP Canjeable', icon: '🎟️', desc: 'Vale dorado exclusivo con botón de "Canjear ahora".' },
  challenge: { label: 'Elección / Misión', icon: '✨', desc: 'Ella elige su plan favorito y recibe un mensaje único al tocar.' }
};

export const IDEAS_BANK = [
  {
    day: 1,
    act: 'Acto I · La Chispa',
    dynamicType: 'classic',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo I · Donde comienza la magia',
    unlockedTitle: 'Bienvenida a tu mes, amor mío',
    suggestion: 'Entrégale hoy la tarjeta física con el QR junto a un detalle pequeño o su café favorito. Deja este primer capítulo autorizado para abrir el viaje.',
    message: 'Mi princesa, desde hoy y hasta el 12 de diciembre cuando cumplas tus 29 años, cada capítulo de este lugar guardará algo pensado solo para ti.\n\nNo podrás abrir ninguno hasta que yo dé la señal... porque lo mejor de la vida sabe más rico cuando se espera con ilusión.\n\nFeliz inicio de tu cuenta regresiva, amor mío. Te amo más de lo que cabría en mil páginas.',
    dynamicPayload: {}
  },
  {
    day: 2,
    act: 'Acto I · La Chispa',
    dynamicType: 'trivia',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo II · Solo tú sabes la respuesta',
    unlockedTitle: 'Prueba de memoria de nosotros',
    suggestion: '¡Súper interactiva! Cada opción que toque le mostrará un pop-up distinto en pantalla. Si quieres, personaliza la pregunta con un recuerdo real de su primera cita.',
    message: 'Antes de revelarte tu premio de hoy, quiero ver qué tan conectada estás con nuestro inicio...',
    dynamicPayload: {
      question: '¿Qué es lo que más me enamoró de ti desde el principio?',
      options: [
        'Tu sonrisa cuando te ríes sin parar',
        'Cómo me miras cuando hablamos de frente',
        'Tu forma única de iluminar cualquier lugar',
        '¡Todas las anteriores sin dudarlo!'
      ],
      optionFeedbacks: [
        '¡Ay, casi! Esa risa tuya me derrite el alma, princesa... pero hay algo todavía más completo 😘',
        '¡Esos ojos tuyos me hipnotizan cada vez! Pero quédate pensando un segundo más...',
        '¡Totalmente cierto! Llegas tú y todo brilla... pero mira la última opción con atención 😉',
        '¡EXACTO, amor mío! No podía quedarme con una sola cosa de ti. Premio de hoy: esta noche el antojo dulce que pidas corre por mi cuenta 🍫💖'
      ],
      correctIndex: 3,
      hint: 'Pista: ¡No podía elegir solo una cosa de ti!',
      rewardText: '¡Acertaste, amor mío! El antojo dulce de esta noche corre por mi cuenta 🍫💖'
    }
  },
  {
    day: 3,
    act: 'Acto I · La Chispa',
    dynamicType: 'scratch',
    allowReply: false,
    hasSunflowers: true,
    teaserTitle: 'Capítulo III · Raspa bajo girasoles',
    unlockedTitle: 'Un capricho dorado para mi princesa 🌻',
    suggestion: 'Este día incluye girasoles especiales 🌻 en pantalla. Sube una selfie linda de ambos y sorpréndela con un antojo o cena.',
    message: 'Hoy no hay acertijos... solo desliza tu dedo sobre el oro para descubrir el capricho que te espera.',
    dynamicPayload: {
      prompt: 'Raspa el velo dorado con tu dedo',
      secretReward: 'Vale por una cena o pedido a domicilio de tu restaurante favorito esta semana 🍷✨'
    }
  },
  {
    day: 4,
    act: 'Acto I · La Chispa',
    dynamicType: 'classic',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo IV · Escucha mi voz',
    unlockedTitle: 'Palabras que prefiero decirte al oído',
    suggestion: 'Usa el grabador de micrófono en Admin para grabarle una nota de voz de 25 segundos diciéndole 3 cosas que amas y admiras de ella.',
    message: 'A veces las letras se quedan cortas. Dale play al audio de arriba y cierra los ojos un segundo, amor mío.',
    dynamicPayload: {}
  },
  {
    day: 5,
    act: 'Acto I · La Chispa',
    dynamicType: 'challenge',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo V · Tú decides el plan',
    unlockedTitle: 'Elige tu aventura de este fin de semana',
    suggestion: 'Cada opción muestra una confirmación diferente y romántica en pantalla, y guarda en tu Admin cuál eligió.',
    message: 'Este fin de semana mandas tú, mi princesa. Toca el plan que más te provoque para hacerlo realidad:',
    dynamicPayload: {
      prompt: '¿Qué plan te provoca más para nuestra próxima cita?',
      choices: [
        'Noche elegante: cocteles, música y cena especial',
        'Plan íntimo: película, manta, comida rica y cero afán',
        'Sorpréndeme tú eligiendo un lugar secreto'
      ],
      choiceFeedbacks: [
        '¡Me encanta! Ve alistando ese outfit espectacular porque nos vamos de noche elegante 🥂✨',
        '¡Plan perfecto! Yo me encargo de tu comida favorita, mantas y cero afán en el mundo 🎬💖',
        '¡Acepto el reto, amor mío! Prepárate porque te voy a llevar a un lugar especial sin decirte antes 😉✨'
      ]
    }
  },
  {
    day: 6,
    act: 'Acto I · La Chispa',
    dynamicType: 'clue',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo VI · Algo escondido cerca de ti',
    unlockedTitle: 'Búsqueda del tesoro · Pista #1',
    suggestion: 'Esconde un detallito físico (crema, chocolate, nota o accesorio) en su bolso, almohada o carro con una palabra secreta escrita.',
    message: 'Hoy dejé algo pequeño en el mundo real esperándote. Encuentra la nota escondida y escribe aquí la palabra clave.',
    dynamicPayload: {
      riddle: 'Busca donde guardas lo que usas justo antes de salir de casa cada mañana... ahí hay una nota con una palabra secreta.',
      secretCode: 'SIEMPRE',
      rewardText: '¡Lo encontraste! Que este pequeño detalle te recuerde que pienso en ti desde que amanece.'
    }
  },
  {
    day: 7,
    act: 'Acto I · La Chispa',
    dynamicType: 'coupon',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo VII · Primera semana completada',
    unlockedTitle: 'Cupón VIP: Cero estrés',
    suggestion: 'Cierra la primera semana consintiéndola de verdad con un masaje y cero responsabilidades.',
    message: 'Completamos los primeros 7 capítulos. Como premio por iluminar mi semana, aquí tienes tu primer pase VIP.',
    dynamicPayload: {
      couponTitle: 'MASAJE RELAX + TARDE LIBRE DE TODO',
      couponDesc: '45 minutos de masaje con aceite tibio, tu música favorita y yo encargándome de todo.'
    }
  },
  {
    day: 8,
    act: 'Acto II · Complicidad',
    dynamicType: 'classic',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo VIII · Un viaje en el tiempo',
    unlockedTitle: 'Nuestras fotos favoritas (Parte I)',
    suggestion: 'Sube 3 o 4 fotos de un viaje o momento inolvidable juntos y escribe detrás qué sentiste ese día.',
    message: 'Estaba mirando nuestra galería y encontré estos momentos. Si pudiera congelar el tiempo, volvería a reírme contigo exactamente así.',
    dynamicPayload: {}
  },
  {
    day: 9,
    act: 'Acto II · Complicidad',
    dynamicType: 'scratch',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo IX · Brilla bajo el oro',
    unlockedTitle: 'Sorpresa de media mañana',
    suggestion: 'Envíale o llévale hoy su bebida/postre favorito al trabajo o casa justo después de que raspe el cupón.',
    message: 'Solo quiero hacer que hoy sea un poquito más dulce que ayer. Raspa aquí abajo:',
    dynamicPayload: {
      prompt: 'Descubre qué viene en camino hoy',
      secretReward: '¡Un café / postre sorpresa pensado justo para alegrarte el día hoy! ☕🍰'
    }
  },
  {
    day: 10,
    act: 'Acto II · Complicidad',
    dynamicType: 'trivia',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo X · Un tercio del camino',
    unlockedTitle: '10 días y contando...',
    suggestion: 'Trivia sobre una escapada juntos; personaliza las 4 respuestas con bromas o detalles suyos.',
    message: '¡Llegamos al día 10! Veamos qué tan conectada estás con nuestro próximo escape:',
    dynamicPayload: {
      question: 'Si nos escapáramos hoy mismo a un lugar los dos solos, ¿qué no puede faltar en la maleta?',
      options: [
        'Tu cámara y buena música',
        'Ropa cómoda y algo rico para picar',
        'Ganas de perdernos sin mirar el reloj',
        '¡Todo eso junto contigo!'
      ],
      optionFeedbacks: [
        '¡Obvio que música y fotos van! Pero todavía falta algo más...',
        '¡Un buen antojo nunca falla! Aun así falta la respuesta completa 😘',
        '¡Desconectarnos del mundo es la clave! Pero mira la última opción...',
        '¡SÍII, amor mío! Contigo todo plan se multiplica. Prepárate porque antes de tus 29 nos escapamos juntos ✈️💖'
      ],
      correctIndex: 3,
      hint: 'Pista: ¡Contigo todo se suma!',
      rewardText: '¡Exacto! Prepárate porque antes de tus 29 nos hacemos una escapada especial.'
    }
  },
  {
    day: 11,
    act: 'Acto II · Complicidad',
    dynamicType: 'classic',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo XI · 11 razones',
    unlockedTitle: '11 cosas que amo de ti',
    suggestion: 'Lista 11 manías, gestos o cualidades reales de ella (cómo sonríe, su voz, su valentía).',
    message: 'Hoy es capítulo 11, así que aquí van 11 cosas reales que amo de ti:\n1. Tu risa contagiosa.\n2. Tu valentía para luchar por tus sueños.\n3. La paz que siento cuando me abrazas.\n(Completa las otras 8 con detalles bien reales de ustedes...)',
    dynamicPayload: {}
  },
  {
    day: 12,
    act: 'Acto II · Complicidad',
    dynamicType: 'challenge',
    allowReply: true,
    hasSunflowers: false,
    teaserTitle: 'Capítulo XII · Confesión nocturna',
    unlockedTitle: 'Tu turno de pedirme un deseo',
    suggestion: 'Aquí SÍ viene activada la caja para que te escriba un deseo de sus 29 y te lo pueda mandar por WhatsApp.',
    message: 'Hoy quiero escuchar tu corazón. En tus próximos 29 años quiero ser tu cómplice número uno.',
    dynamicPayload: {
      prompt: 'Elige una categoría para tu deseo de los 29 (y si quieres, cuéntamelo en la caja de abajo):',
      choices: [
        'Un viaje o lugar nuevo que muero por conocer',
        'Una experiencia diferente que nunca he probado',
        'Algo especial para mí / mi bienestar'
      ],
      choiceFeedbacks: [
        '¡Anotado, viajera! Escríbeme abajo qué destino sueñas y lo ponemos en la mira ✈️🌍',
        '¡Amo tu espíritu aventurero! Cuéntame abajo qué locura bonita quieres vivir ✨',
        '¡Te lo mereces todo, princesa! Escríbeme abajo cómo quieres consentirte 💐💖'
      ]
    }
  },
  {
    day: 13,
    act: 'Acto II · Complicidad',
    dynamicType: 'coupon',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo XIII · Pase de fotografía',
    unlockedTitle: 'Sesión privada de fotos & atardecer',
    suggestion: 'Invítala a arreglarse bonita para una tarde de fotos juntos (esas fotos luego alimentan el video final).',
    message: 'Porque mereces sentirte como portada de revista todos los días...',
    dynamicPayload: {
      couponTitle: 'TARDE DE FOTOS + HELADO / CÓCTEL AL ATARDECER',
      couponDesc: 'Ponte tu outfit favorito: hoy soy tu fotógrafo oficial y vamos por algo rico mirando el atardecer.'
    }
  },
  {
    day: 14,
    act: 'Acto II · Complicidad',
    dynamicType: 'clue',
    allowReply: false,
    hasSunflowers: true,
    teaserTitle: 'Capítulo XIV · Mitad del viaje 🌻',
    unlockedTitle: 'Búsqueda del tesoro · Pista #2 🌻',
    suggestion: 'Mitad del camino con girasoles 🌻! Ideal para regalarle un ramo de girasoles real o un regalo mediano escondido.',
    message: '¡Mitad del camino, mi princesa! Hoy la sorpresa física viene acompañada de tus flores favoritas.',
    dynamicPayload: {
      riddle: 'Busca en un rincón especial cerca de donde descansas o guardas tus cosas más preciadas...',
      secretCode: 'GIRASOL',
      rewardText: '¡Lo encontraste! Que siempre brilles tan radiante como un girasol mirando al sol 🌻💛'
    }
  },
  {
    day: 15,
    act: 'Acto III · Adrenalina',
    dynamicType: 'classic',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo XV · Video secreto',
    unlockedTitle: 'Un mensaje grabado para ti',
    suggestion: 'Graba un video corto mirando a cámara diciéndole cuánto la amas o un saludo sorpresa.',
    message: 'Hoy quise dejarte algo que puedas ver una y otra vez cuando me extrañes.',
    dynamicPayload: {}
  },
  {
    day: 16,
    act: 'Acto III · Adrenalina',
    dynamicType: 'scratch',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo XVI · Boleto dorado',
    unlockedTitle: 'Noche de película VIP',
    suggestion: 'Prepara palomitas/vino/sushi en casa o compra entradas VIP de cine.',
    message: 'Raspa este boleto dorado para conocer tu función especial de esta noche:',
    dynamicPayload: {
      prompt: 'Raspa tu entrada VIP',
      secretReward: 'Pase doble VIP para cine o maratón en casa con tus snacks favoritos incluidos 🍿🥂'
    }
  },
  {
    day: 17,
    act: 'Acto III · Adrenalina',
    dynamicType: 'trivia',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo XVII · ¿Qué tanto me conoces?',
    unlockedTitle: 'Reto divertido de pareja',
    suggestion: 'Cada opción tiene una respuesta coqueta/divertida distinta en pantalla.',
    message: 'Hoy cambiamos las reglas: veamos qué tan bien me tienes leído...',
    dynamicPayload: {
      question: '¿Cuál es mi debilidad número uno cuando estás cerca?',
      options: [
        'Tu aroma y un abrazo en el cuello',
        'Cuando te ríes a carcajadas',
        'Cuando me miras con cara de travesura',
        '¡No puedo resistirme a ninguna de las tres!'
      ],
      optionFeedbacks: [
        '¡Uf, totalmente cierto! Ese perfume tuyo me desarma... pero hay más 😘',
        '¡Tu risa es mi sonido favorito! Sigue intentando...',
        '¡Esa mirada peligrosa me vuelve loco! Pero mira la última opción 😉',
        '¡Me conoces demasiado bien! Hoy te toca cobrar diez besos largos de interés 💋🔥'
      ],
      correctIndex: 3,
      hint: 'Pista: ¡Me derrito con todo de ti!',
      rewardText: '¡Correcto! Hoy cobras diez besos largos de interés 💋'
    }
  },
  {
    day: 18,
    act: 'Acto III · Adrenalina',
    dynamicType: 'challenge',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo XVIII · Sorpresa gastronómica',
    unlockedTitle: 'Menú secreto de esta noche',
    suggestion: 'Cocínale su plato favorito o llévala a probar el estilo que elija.',
    message: 'Esta noche no cocinas ni mueves un dedo. Tú solo elige el estilo de tu antojo:',
    dynamicPayload: {
      prompt: 'Elige la vibra de tu cena:',
      choices: [
        'Italiana: pasta, vino y velas',
        'Asiática: sushi / ramen especial',
        'Parrilla / Burgers gourmet & cocteles'
      ],
      choiceFeedbacks: [
        '¡Bellísima elección! Prepara tu apetito que esta noche nos vamos de pasta y vino 🍝🍷',
        '¡Sushi y sabores increíbles en camino! Hoy se te cumple el antojo 🍣✨',
        '¡Plan delicioso! Cocteles y algo bien rico para brindar por ti 🍔🥂'
      ]
    }
  },
  {
    day: 19,
    act: 'Acto III · Adrenalina',
    dynamicType: 'classic',
    allowReply: true,
    hasSunflowers: false,
    teaserTitle: 'Capítulo XIX · Carta al futuro',
    unlockedTitle: 'Lo que sueño construir contigo',
    suggestion: 'Carta profunda sobre proyectos futuros y lo orgulloso que estás de la mujer en la que se convierte a los 29 (con caja de respuesta opcional activada).',
    message: 'Cumplir 29 no es solo sumar un año más: es mirar todo lo que has crecido, lo fuerte que eres y la mujer increíble que tengo la suerte de caminar de la mano.\n\nEsto es solo el comienzo de nuestra mejor etapa, amor mío.',
    dynamicPayload: {}
  },
  {
    day: 20,
    act: 'Acto III · Adrenalina',
    dynamicType: 'coupon',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo XX · Últimos 10 días',
    unlockedTitle: 'Día de consentimiento / Beauty pass',
    suggestion: 'Regálale uñas, spa, peluquería o un kit de skincare antes de la semana final para que brille en su cumple.',
    message: 'Faltan solo 10 capítulos para tu gran día y quiero verte brillando como la princesa que eres.',
    dynamicPayload: {
      couponTitle: 'PASAPORTE BEAUTY & SPA',
      couponDesc: 'Válido para consentirte (uñas, spa o tu tratamiento favorito) antes de tu fiesta de los 29 ✨'
    }
  },
  {
    day: 21,
    act: 'Acto III · Adrenalina',
    dynamicType: 'clue',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo XXI · Pista #3 (Nivel experto)',
    unlockedTitle: 'El código del atardecer',
    suggestion: 'Esconde un detallito en el carro o un bolsillo de su chaqueta favorita.',
    message: 'Cada vez estás más cerca del final... busca el código secreto de hoy:',
    dynamicPayload: {
      riddle: 'Está guardado dentro de algo que te pones cuando hace frío o en la guantera donde viajamos juntos...',
      secretCode: 'BRILLA',
      rewardText: '¡Excelente detective! Hoy te ganaste un abrazo eterno y un detalle especial.'
    }
  },
  {
    day: 22,
    act: 'Acto IV · Cuenta Épica',
    dynamicType: 'classic',
    allowReply: false,
    hasSunflowers: true,
    teaserTitle: 'Capítulo XXII · Voces que te aman 🌻',
    unlockedTitle: 'Sorpresa de personas especiales 🌻',
    suggestion: 'Pide a 2-3 amigas cercanas o familiares un audio o video corto de 15 seg felicitándola por adelantado y súbelos aquí (decorado con girasoles!).',
    message: 'No soy el único que celebra tu vida, amor mío... escucha y mira quiénes se sumaron hoy a tu cuenta regresiva.',
    dynamicPayload: {}
  },
  {
    day: 23,
    act: 'Acto IV · Cuenta Épica',
    dynamicType: 'scratch',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo XXIII · Primera pista del gran regalo',
    unlockedTitle: 'Un destello de tu regalo mayor',
    suggestion: 'Empieza a dar micro-pistas del regalo grande del cumpleaños (un viaje, joya, concierto, etc.).',
    message: 'Todavía faltan pocos días... pero hoy voy a dejar que raspes una pequeña pista de lo que viene al final:',
    dynamicPayload: {
      prompt: 'Raspa para ver la pista #1 del gran regalo',
      secretReward: 'Pista: Involucra una fecha especial, mucha emoción y algo que llevas tiempo queriendo vivir ✨'
    }
  },
  {
    day: 24,
    act: 'Acto IV · Cuenta Épica',
    dynamicType: 'trivia',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo XXIV · Nuestros momentos top',
    unlockedTitle: '¿Recuerdas este día?',
    suggestion: 'Sube una foto icónica de ustedes y personaliza las 4 reacciones de lo que pasó ese día.',
    message: 'Mira la foto de arriba y contesta rápido:',
    dynamicPayload: {
      question: '¿Qué fue lo mejor de ese día juntos?',
      options: [
        'Lo rico que comimos',
        'Que no paramos de reírnos',
        'El abrazo al final del día',
        '¡Todo, porque era contigo!'
      ],
      optionFeedbacks: [
        '¡Estuvo delicioso! Pero hubo algo mejor todavía 😋',
        '¡Esas carcajadas no las cambio por nada! Sigue intentando...',
        '¡Ese abrazo recargó mi alma entera! Pero mira la última...',
        '¡Exactamente, mi princesa! Contigo hasta un día normal se vuelve inolvidable 💖'
      ],
      correctIndex: 3,
      hint: 'Pista: Siempre es la misma magia.',
      rewardText: '¡Eso mismo! Y esta semana crearemos recuerdos aún más épicos.'
    }
  },
  {
    day: 25,
    act: 'Acto IV · Cuenta Épica',
    dynamicType: 'challenge',
    allowReply: true,
    hasSunflowers: false,
    teaserTitle: 'Capítulo XXV · Código de vestimenta',
    unlockedTitle: 'Prepárate para celebrar',
    suggestion: 'Empieza a crear expectativa sobre cómo quieres verla vestida o qué vibra prefiere para su cumple.',
    message: 'Faltan apenas días para tu 12 de diciembre. Confírmame esto para el gran cierre:',
    dynamicPayload: {
      prompt: '¿Cómo quieres sentirte el día de tus 29?',
      choices: [
        'Elegante y espectacular en una noche inolvidable',
        'Rodeada de música, brindis y mucha risa',
        'Íntima, romántica y completamente consentida'
      ],
      choiceFeedbacks: [
        '¡Así será, reina mía! Alista tu look más espectacular porque vas a brillar ✨👑',
        '¡Que suene nuestra playlist y no falte el brindis! Va a ser épico 🥂🎶',
        '¡Totalmente consentida de principio a fin, te lo prometo! 💖✨'
      ]
    }
  },
  {
    day: 26,
    act: 'Acto IV · Cuenta Épica',
    dynamicType: 'coupon',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo XXVI · Brindis anticipado',
    unlockedTitle: 'Copa & confesiones bajo la luna',
    suggestion: 'Sube una foto linda y ten listo su vino/coctel favorito para brindar hoy.',
    message: 'Antes de que empiece el torbellino del cumpleaños, quiero una noche tranquila solo tú y yo.',
    dynamicPayload: {
      couponTitle: 'BRINDIS PRIVADO POR TUS 28 QUE SE VAN',
      couponDesc: 'Una copa de tu bebida favorita mientras recordamos todo lo bonito que viviste en tus 28.'
    }
  },
  {
    day: 27,
    act: 'Acto IV · Cuenta Épica',
    dynamicType: 'clue',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo XXVII · Casi en la meta',
    unlockedTitle: 'La llave de los últimos días',
    suggestion: 'Dile un código al oído en la mañana para que lo ingrese en la app durante el día.',
    message: 'Hoy no está escondido en un mueble... el código secreto de hoy te lo voy a decir yo al oído (o por nota de voz).',
    dynamicPayload: {
      riddle: 'Pregúntame o escucha la palabra secreta que te susurré hoy...',
      secretCode: 'TEAMO',
      rewardText: '¡Desbloqueado! Pista #2 del gran regalo: alista una sonrisa enorme porque viene algo inolvidable.'
    }
  },
  {
    day: 28,
    act: 'Acto IV · Cuenta Épica',
    dynamicType: 'classic',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo XXVIII · La víspera mágica',
    unlockedTitle: 'Muy pronto termina la espera...',
    suggestion: 'Prepara el corazón para la víspera del cumpleaños: sube una foto tuya con un detalle bonito.',
    message: 'Falta casi nada para tus 29. Gracias por regalarme el privilegio de verte brillar un año más.\n\nLo mejor de todo este mes se acerca rápido. Descansa lindo, mi vida.',
    dynamicPayload: {}
  },
  {
    day: 29,
    act: 'Gran Final · Tus 29',
    dynamicType: 'scratch',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo XXIX · Víspera del Gran Video',
    unlockedTitle: 'El Telón está por subir 🎬',
    suggestion: '¡El día previo al cumpleaños! Activa también el botón del "Gran Cine / Video Resumen" en la pestaña Gran Final.',
    message: 'Llegamos al capítulo 29... tu número mágico.\n\nRaspa este boleto dorado y luego mira el botón del **Cine de Recuerdos** en tu pantalla principal.',
    dynamicPayload: {
      prompt: 'Raspa tu invitación al Gran Estreno',
      secretReward: '¡CINE DE RECUERDOS ACTIVADO! Sube arriba y dale play a nuestra película de estos días 🎬✨'
    }
  },
  {
    day: 30,
    act: 'Gran Final · Tus 29',
    dynamicType: 'classic',
    allowReply: true,
    hasSunflowers: true,
    teaserTitle: 'Capítulo XXX · ¡FELICES 29 AÑOS! 👑🌻',
    unlockedTitle: '¡Feliz Cumpleaños #29, Amor Mío! 👑✨',
    suggestion: 'El gran día (12 de diciembre) con girasoles especiales 🌻. Sube aquí el video final definitivo o la revelación del regalo mayor.',
    message: '¡FELIZ CUMPLEAÑOS #29, MI PRINCESA!\n\nTreinta días, treinta latidos y un solo propósito: hacerte sentir la mujer más amada, admirada y especial del planeta.\n\nQue tus 29 años estén llenos de salud, sueños cumplidos, risas hasta llorar y momentos eternos a mi lado.\n\nHoy celebramos tu vida, amor mío. ¡Te amo con toda mi alma!',
    dynamicPayload: {}
  }
];

/**
 * Alternativas creativas (Plan B) para que el novio tenga variedad si quiere cambiar la dinámica de cualquier día.
 */
export const ALTERNATIVE_IDEAS = {
  1: {
    dynamicType: 'coupon',
    allowReply: false,
    hasSunflowers: true,
    teaserTitle: 'Capítulo I · Tu pase dorado inicial 🌻',
    unlockedTitle: 'Pasaporte oficial a tus 29 ✨',
    suggestion: 'Plan B Día 1: En vez de solo carta, empieza entregándole un Cupón VIP simbólico que inaugure los 30 días.',
    message: 'Hoy arranca oficialmente tu mes de sorpresas, mi princesa. Canjea este pase inaugural para activar la magia.',
    dynamicPayload: {
      couponTitle: 'PASAPORTE VIP · 30 DÍAS DE AMOR',
      couponDesc: 'Válido para ser consentida, sorprendida y amada sin límites rumbo a tus 29 años 🌻✨'
    }
  },
  2: {
    dynamicType: 'challenge',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo II · Elige tu premio hoy',
    unlockedTitle: '¿Qué te consiente más hoy?',
    suggestion: 'Plan B Día 2: En lugar de Trivia, dale a elegir entre 3 antojos reales para llevárselo hoy mismo.',
    message: 'Hoy quiero consentir tu día con algo rico. Elige qué se te antoja más:',
    dynamicPayload: {
      prompt: 'Toca tu antojo ganador de hoy:',
      choices: [
        'Chocolate / Postre favorito',
        'Café especial o bebida fría',
        'Un abrazo eterno + sorpresa misteriosa'
      ],
      choiceFeedbacks: [
        '¡Dulce para la mujer más dulce! En camino tu antojo de chocolate 🍫💖',
        '¡Anotado! Tu bebida favorita va directo a alegrarte el día ☕✨',
        '¡Qué mejor elección! Prepárate para un abrazo de esos que reinician el alma 🤗💛'
      ]
    }
  },
  3: {
    dynamicType: 'trivia',
    allowReply: false,
    hasSunflowers: true,
    teaserTitle: 'Capítulo III · Desafío de girasoles 🌻',
    unlockedTitle: '¿Cuánto conoces de mis gustos por ti? 🌻',
    suggestion: 'Plan B Día 3: Trivia romántica con girasoles y un premio sorpresa distinto por respuesta.',
    message: 'Veamos si adivinas qué pienso cuando te veo arreglada...',
    dynamicPayload: {
      question: '¿Qué es lo primero que pienso cuando te veo llegar toda linda?',
      options: [
        'Qué suerte tengo de tenerla',
        'Hoy no le quito los ojos de encima',
        'Se ve más hermosa cada día',
        '¡Las tres al mismo tiempo!'
      ],
      optionFeedbacks: [
        '¡Lo pienso cada segundo! Pero es todavía más grande que eso 😘',
        '¡Literalmente me hipnotizas! Aun así falta algo...',
        '¡Cada año te pones más espectacular! Mira la cuarta opción 😉',
        '¡BINGO, mi princesa! Eres mi obra de arte favorita 🌻👑'
      ],
      correctIndex: 3,
      hint: 'Pista: ¡Todo junto!',
      rewardText: '¡BINGO! Ganaste un beso largo y una salida por tu postre favorito 🌻✨'
    }
  }
};

export function getIdeaForDay(day, variant = 'A') {
  const base = IDEAS_BANK.find((i) => i.day === day) || IDEAS_BANK[0];
  if (variant === 'B' && ALTERNATIVE_IDEAS[day]) {
    return { ...base, ...ALTERNATIVE_IDEAS[day], day, act: base.act };
  }
  if (variant === 'B') {
    // Smart rotating Plan B for days 4..30 so EVERY day has an alternative idea!
    const altTypes = ['scratch', 'trivia', 'coupon', 'challenge', 'classic'];
    const altType = altTypes[(day + 1) % altTypes.length];
    return buildFallbackPlanB(base, altType);
  }
  return base;
}

function buildFallbackPlanB(base, altType) {
  if (altType === 'scratch') {
    return {
      ...base,
      dynamicType: 'scratch',
      suggestion: 'Plan B (Raspa y Gana): Convierte el detalle de hoy en una tarjeta dorada sorpresa para que raspe con su dedo.',
      dynamicPayload: {
        prompt: 'Raspa el oro para descubrir el detalle de hoy',
        secretReward: `¡Sorpresa del Capítulo ${String(base.day).padStart(2, '0')}! Hoy tienes un capricho especial conmigo ✨`
      }
    };
  }
  if (altType === 'coupon') {
    return {
      ...base,
      dynamicType: 'coupon',
      suggestion: 'Plan B (Cupón VIP): Regálale un vale canjeable por un detalle o tiempo juntos sin celular.',
      dynamicPayload: {
        couponTitle: `VALE ESPECIAL · CAPÍTULO ${String(base.day).padStart(2, '0')}`,
        couponDesc: 'Válido por 1 hora de atención total, mimos y cero distracciones contigo ✨'
      }
    };
  }
  if (altType === 'trivia') {
    return {
      ...base,
      dynamicType: 'trivia',
      suggestion: 'Plan B (Trivia): Pregúntale un dato único de ustedes y ponle 4 reacciones distintas en pantalla.',
      dynamicPayload: {
        question: '¿Cuál de estos momentos conmigo repetirías mil veces?',
        options: [
          'Una tarde de risas sin parar',
          'Una cena romántica los dos solos',
          'Un viaje improvisado con buena música',
          '¡Cualquiera mientras estemos juntos!'
        ],
        optionFeedbacks: [
          '¡Reír contigo es mi terapia favorita! Pero hay una respuesta todavía más cierta 😘',
          '¡Con una copa y mirándote a los ojos! Mira la última opción...',
          '¡Cantando a todo pulmón en carretera! Aun así falta la ganadora 😉',
          '¡Exacto, amor mío! Contigo hasta el plan más simple es magia ✨💖'
        ],
        correctIndex: 3,
        hint: 'Pista: ¡Lo importante siempre es el "contigo"!',
        rewardText: '¡Acertaste! Próximo plan juntos en camino 💖'
      }
    };
  }
  if (altType === 'challenge') {
    return {
      ...base,
      dynamicType: 'challenge',
      suggestion: 'Plan B (Elección): Deja que ella escoja entre 3 detalles para saber exactamente cómo sorprenderla.',
      dynamicPayload: {
        prompt: '¿Cómo prefieres que te consienta hoy?',
        choices: ['Con algo dulce', 'Con música y abrazo largo', 'Con una salida improvisada'],
        choiceFeedbacks: [
          '¡Dulce en camino para ti, mi princesa! 🍫✨',
          '¡Música puesta y abrazo gigante reservado para ti! 🎶🤗',
          '¡Me encanta tu energía! Prepárate para salir juntos ✨🚗'
        ]
      }
    };
  }
  return {
    ...base,
    dynamicType: 'classic',
    suggestion: 'Plan B (Carta Íntima + Foto/Audio): Una carta directa al corazón acompañada de una foto especial o nota de voz.',
    dynamicPayload: {}
  };
}
