/**
 * ============================================================================
 * BANCO CREATIVO DE 30 DÍAS ESCALABLES ("MEJOR CADA DÍA")
 * Diseñado en 4 actos crecientes + Gran Final para sorprenderla sin repetir.
 * ============================================================================
 */

export const DYNAMIC_TYPES = {
  classic: { label: 'Carta & Recuerdo', icon: '💌', desc: 'Mensaje íntimo, fotos, video o nota de voz.' },
  scratch: { label: 'Raspa y Gana Dorado', icon: '🪙', desc: 'Tarjeta metálica dorada que raspa con su dedo para revelar el premio.' },
  trivia: { label: 'Trivia de Nosotros', icon: '🧠', desc: 'Pregunta romántica con pistas; al acertar revela la sorpresa.' },
  clue: { label: 'Búsqueda del Tesoro', icon: '🕵️‍♀️', desc: 'Acertijo o pista física + palabra clave secreta para abrir el regalo.' },
  coupon: { label: 'Cupón VIP Canjeable', icon: '🎟️', desc: 'Vale dorado exclusivo con botón de "Canjear ahora".' },
  challenge: { label: 'Elección / Misión', icon: '✨', desc: 'Ella elige su plan/antojo favorito o responde un reto.' }
};

export const IDEAS_BANK = [
  {
    day: 1,
    act: 'Acto I · La Chispa',
    dynamicType: 'classic',
    teaserTitle: 'Capítulo I · Donde comienza la magia',
    unlockedTitle: 'Bienvenida a tu mes, amor mío',
    suggestion: 'Entrégale hoy la tarjeta física con el QR junto a una rosa o su café favorito. Deja este primer capítulo autorizado para que vea que todo es real.',
    message: 'Mi princesa, desde hoy y hasta el 12 de diciembre cuando cumplas tus 29 años, cada capítulo de este lugar guardará algo pensado solo para ti.\n\nNo podrás abrir ninguno hasta que yo dé la señal... porque lo mejor de la vida sabe más rico cuando se espera con ilusión.\n\nFeliz inicio de tu cuenta regresiva, amor mío. Te amo más de lo que cabría en mil páginas.',
    dynamicPayload: {}
  },
  {
    day: 2,
    act: 'Acto I · La Chispa',
    dynamicType: 'trivia',
    teaserTitle: 'Capítulo II · Solo tú sabes la respuesta',
    unlockedTitle: 'Prueba de memoria de nosotros',
    suggestion: 'Personaliza la pregunta con un dato icónico de su primera cita o primer beso, y dale un chocolate o dulce favorito si acierta.',
    message: 'Antes de darte tu sorpresa de hoy, quiero comprobar si recuerdas los detalles que me enamoraron desde el primer día...',
    dynamicPayload: {
      question: '¿Qué es lo que más me enamoró de ti desde el inicio?',
      options: ['Tu sonrisa cuando te ríes sin parar', 'Cómo me miras cuando hablamos', 'Tu forma única de iluminar cualquier lugar', '¡Todas las anteriores sin duda!'],
      correctIndex: 3,
      hint: 'Pista: No podía elegir solo una cosa de ti...',
      rewardText: '¡Acertaste! Tu premio de hoy: esta noche el antojo dulce que pidas corre por mi cuenta.'
    }
  },
  {
    day: 3,
    act: 'Acto I · La Chispa',
    dynamicType: 'scratch',
    teaserTitle: 'Capítulo III · Raspa para descubrir',
    unlockedTitle: 'Un capricho dorado para ti',
    suggestion: 'Sube una selfie linda de ambos y deja que raspe el premio de hoy.',
    message: 'Hoy no hay acertijos... solo desliza tu dedo sobre el oro para descubrir el primer capricho de este mes.',
    dynamicPayload: {
      prompt: 'Raspa el velo dorado con tu dedo',
      secretReward: 'Vale por una cena o pedido a domicilio de tu restaurante favorito esta semana 🍷✨'
    }
  },
  {
    day: 4,
    act: 'Acto I · La Chispa',
    dynamicType: 'classic',
    teaserTitle: 'Capítulo IV · Escucha mi voz',
    unlockedTitle: 'Palabras que prefiero decirte al oído',
    suggestion: 'Usa el grabador de micrófono en Admin para grabarle un audio de 20-30 segundos diciéndole 3 cosas que admiras de ella.',
    message: 'A veces las letras se quedan cortas. Dale play al audio de arriba y cierra los ojos un segundo.',
    dynamicPayload: {}
  },
  {
    day: 5,
    act: 'Acto I · La Chispa',
    dynamicType: 'challenge',
    teaserTitle: 'Capítulo V · Tú decides el plan',
    unlockedTitle: 'Elige tu aventura de este fin de semana',
    suggestion: 'Dale dos opciones reales de cita para que sienta que está diseñando el mes contigo.',
    message: 'Este fin de semana te toca ser la directora. Elige cuál de estos dos planes quieres que hagamos realidad:',
    dynamicPayload: {
      prompt: '¿Qué plan te provoca más para nuestra próxima cita?',
      choices: ['Noche elegante: cocteles, música y cena especial', 'Plan íntimo: película, manta, comida rica y cero afán', 'Sorpréndeme tú eligiendo el lugar secreto']
    }
  },
  {
    day: 6,
    act: 'Acto I · La Chispa',
    dynamicType: 'clue',
    teaserTitle: 'Capítulo VI · Algo escondido cerca de ti',
    unlockedTitle: 'Búsqueda del tesoro · Pista #1',
    suggestion: 'Esconde un detallito físico (crema, perfume mini, nota escrita o accesorio) en su bolso, almohada o carro con una palabra secreta escrita.',
    message: 'Hoy dejé algo pequeño en el mundo real esperándote. Encuentra el sobre/nota escondida y escribe aquí la palabra clave que dice dentro.',
    dynamicPayload: {
      riddle: 'Busca en el lugar donde guardas lo que usas justo antes de salir de casa cada mañana... ahí hay una nota con una palabra secreta.',
      secretCode: 'SIEMPRE',
      rewardText: '¡Lo encontraste! Ahora mira el pequeño detalle que dejé ahí para recordarte que pienso en ti cada mañana.'
    }
  },
  {
    day: 7,
    act: 'Acto I · La Chispa',
    dynamicType: 'coupon',
    teaserTitle: 'Capítulo VII · Primera semana completada',
    unlockedTitle: 'Cupón VIP: Cero estrés',
    suggestion: 'Cierra la primera semana consintiéndola de verdad.',
    message: 'Ya completamos los primeros 7 capítulos. Como premio por iluminar mi semana, aquí tienes un pase VIP oficial.',
    dynamicPayload: {
      couponTitle: 'MASAJE RELAX + TARDE LIBRE DE TODO',
      couponDesc: '45 minutos de masaje con aceite tibio, tu serie o música favorita y yo encargándome de todo.'
    }
  },
  {
    day: 8,
    act: 'Acto II · Complicidad',
    dynamicType: 'classic',
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
    teaserTitle: 'Capítulo IX · Brilla bajo el oro',
    unlockedTitle: 'Sorpresa de media mañana',
    suggestion: 'Envíale o llévale hoy su bebida/snack favorito al trabajo o casa justo después de que raspe el cupón.',
    message: 'Solo quiero hacer que hoy sea un poquito más dulce que ayer. Raspa aquí abajo:',
    dynamicPayload: {
      prompt: 'Descubre qué viene en camino hoy',
      secretReward: '¡Un café/postre sorpresa pensado justo para alegrarte el día hoy!'
    }
  },
  {
    day: 10,
    act: 'Acto II · Complicidad',
    dynamicType: 'trivia',
    teaserTitle: 'Capítulo X · Un tercio del camino',
    unlockedTitle: '10 días y contando...',
    suggestion: 'Pon una foto graciosa o tierna de recompensa cuando conteste bien.',
    message: '¡Llegamos al día 10! Vamos a ver qué tan buena eres recordando nuestras locuras:',
    dynamicPayload: {
      question: 'Si tuviéramos que escapar hoy mismo a un lugar los dos solos, ¿qué no puede faltar en la maleta?',
      options: ['Tu cámara y buena música', 'Ropa cómoda y algo rico para picar', 'Ganas de perdernos sin horario', '¡Todo eso junto contigo!'],
      correctIndex: 3,
      hint: 'Pista: ¡Contigo todo plan se multiplica!',
      rewardText: '¡Exacto! Prepárate porque antes de tus 29 vamos a hacer una escapada especial.'
    }
  },
  {
    day: 11,
    act: 'Acto II · Complicidad',
    dynamicType: 'classic',
    teaserTitle: 'Capítulo XI · 11 razones',
    unlockedTitle: '11 cosas que amo de ti',
    suggestion: 'Lista 11 manías, gestos o cualidades reales de ella (ej. cómo frunce la nariz, su risa, su fortaleza).',
    message: 'Hoy es día 11, así que aquí van 11 cosas reales que amo de ti:\n1. Tu risa contagiosa.\n2. Tu valentía para luchar por lo que quieres.\n3. La paz que siento cuando me abrazas.\n(Personaliza el resto con tus palabras...)',
    dynamicPayload: {}
  },
  {
    day: 12,
    act: 'Acto II · Complicidad',
    dynamicType: 'challenge',
    teaserTitle: 'Capítulo XII · Confesión nocturna',
    unlockedTitle: 'Tu turno de contarme un deseo',
    suggestion: 'Pídele que escriba un sueño o deseo que quiera cumplir en sus 29 años para ayudarle a hacerlo realidad.',
    message: 'Hoy quiero escuchar tu corazón. En tus próximos 29 años quiero ser tu cómplice número uno.',
    dynamicPayload: {
      prompt: 'Elige una categoría para tu deseo de los 29 (y cuéntamelo abajo en tu mensaje):',
      choices: ['Un viaje o lugar nuevo que muero por conocer', 'Una experiencia diferente que nunca he probado', 'Algo especial para mí / mi bienestar']
    }
  },
  {
    day: 13,
    act: 'Acto II · Complicidad',
    dynamicType: 'coupon',
    teaserTitle: 'Capítulo XIII · Pase de fotografía',
    unlockedTitle: 'Sesión privada de fotos & tarde linda',
    suggestion: 'Invítala a arreglarse bonita para una tarde de fotos juntos (esas fotos luego servirán para el video final).',
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
    teaserTitle: 'Capítulo XIV · Mitad del viaje',
    unlockedTitle: 'Búsqueda del tesoro · Pista #2',
    suggestion: 'Sube la intensidad: esconde un regalo mediano (ej. pijama, vela aromática, libro, blusa o joya sencilla) en un sitio inesperado.',
    message: '¡Mitad del camino! Hoy la recompensa física es un poco más grande. Sigue la pista:',
    dynamicPayload: {
      riddle: 'Donde duermes o descansas, busca en un rincón que normalmente no revisas de día...',
      secretCode: 'CATORCE',
      rewardText: '¡Sorpresa! Que este regalo te abrace cuando yo no esté al lado.'
    }
  },
  {
    day: 15,
    act: 'Acto III · Adrenalina',
    dynamicType: 'classic',
    teaserTitle: 'Capítulo XV · Video secreto',
    unlockedTitle: 'Un mensaje grabado para ti',
    suggestion: 'Graba un video corto mirando a cámara diciéndole cuánto la amas o un mensaje sorpresa de alguien querido (familia/amigas).',
    message: 'Hoy quise dejarte algo que puedas ver una y otra vez cuando me extrañes.',
    dynamicPayload: {}
  },
  {
    day: 16,
    act: 'Acto III · Adrenalina',
    dynamicType: 'scratch',
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
    teaserTitle: 'Capítulo XVII · ¿Qué tanto me conoces?',
    unlockedTitle: 'Reto divertido de pareja',
    suggestion: 'Pon una pregunta divertida sobre ti o sobre una anécdota chistosa que solo ustedes entiendan.',
    message: 'Hoy cambiamos las reglas: veamos qué tan bien me tienes leído...',
    dynamicPayload: {
      question: '¿Cuál es mi debilidad número uno cuando estás cerca?',
      options: ['Tu olor y tu cuello', 'Cuando te ríes a carcajadas', 'Cuando me miras con cara de travesura', '¡No puedo resistirme a ninguna de las tres!'],
      correctIndex: 3,
      hint: 'Pista: ¡Me derrito con todo!',
      rewardText: '¡Correcto! Y hoy te toca cobrar diez besos largos de interés.'
    }
  },
  {
    day: 18,
    act: 'Acto III · Adrenalina',
    dynamicType: 'challenge',
    teaserTitle: 'Capítulo XVIII · Sorpresa gastronómica',
    unlockedTitle: 'Menú secreto de esta noche',
    suggestion: 'Cocínale su plato favorito o llévala a probar un sitio nuevo.',
    message: 'Esta noche no cocinas ni mueves un dedo. Tú solo elige el estilo de tu antojo:',
    dynamicPayload: {
      prompt: 'Elige la vibra de tu cena:',
      choices: ['Italiana: pasta, vino y velas', 'Asiática: sushi / ramen especial', 'Parrilla / Burgers gourmet & cocteles']
    }
  },
  {
    day: 19,
    act: 'Acto III · Adrenalina',
    dynamicType: 'classic',
    teaserTitle: 'Capítulo XIX · Carta al futuro',
    unlockedTitle: 'Lo que sueño construir contigo',
    suggestion: 'Una carta profunda sobre proyectos futuros, viajes que harán y lo orgulloso que estás de la mujer en la que se convierte a los 29.',
    message: 'Cumplir 29 no es solo sumar un año más: es mirar todo lo que has crecido, lo fuerte que eres y la mujer increíble que tengo la suerte de caminar de la mano.\n\nEsto es solo el comienzo de nuestra mejor etapa.',
    dynamicPayload: {}
  },
  {
    day: 20,
    act: 'Acto III · Adrenalina',
    dynamicType: 'coupon',
    teaserTitle: 'Capítulo XX · Últimos 10 días',
    unlockedTitle: 'Día de consentimiento / Beauty pass',
    suggestion: 'Regálale uñas, spa, peluquería o un kit de skincare antes de la semana final para que brille en su cumple.',
    message: 'Faltan solo 10 capítulos para tu gran día y quiero verte brillando como la reina que eres.',
    dynamicPayload: {
      couponTitle: 'PASAPORTE BEAUTY & SPA',
      couponDesc: 'Válido para consentirte (uñas, spa o tu tratamiento favorito) antes de tu fiesta de los 29 ✨'
    }
  },
  {
    day: 21,
    act: 'Acto III · Adrenalina',
    dynamicType: 'clue',
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
    teaserTitle: 'Capítulo XXII · Voces que te aman',
    unlockedTitle: 'Sorpresa de personas especiales',
    suggestion: 'Pide a 2-3 amigas cercanas o familiares un audio o video corto de 15 seg felicitándola por adelantado y súbelos aquí!',
    message: 'No soy el único que celebra tu vida... escucha y mira quiénes se sumaron hoy a tu cuenta regresiva.',
    dynamicPayload: {}
  },
  {
    day: 23,
    act: 'Acto IV · Cuenta Épica',
    dynamicType: 'scratch',
    teaserTitle: 'Capítulo XXIII · Primera pista del gran regalo',
    unlockedTitle: 'Un destello de tu regalo mayor',
    suggestion: 'Empieza a dar micro-pistas del regalo grande del cumpleaños (un viaje, joya, concierto, etc.).',
    message: 'Todavía faltan 7 días... pero hoy voy a dejar que raspes apenas una pequeña pista de lo que viene al final:',
    dynamicPayload: {
      prompt: 'Raspa para ver la pista #1 del gran regalo',
      secretReward: 'Pista: Involucra una fecha especial, mucha emoción y algo que llevas tiempo queriendo vivir ✨'
    }
  },
  {
    day: 24,
    act: 'Acto IV · Cuenta Épica',
    dynamicType: 'trivia',
    teaserTitle: 'Capítulo XXIV · Nuestros momentos top',
    unlockedTitle: '¿Recuerdas esta foto?',
    suggestion: 'Sube una foto icónica de ustedes y pregunta dónde estaban o qué pasó justo después.',
    message: 'Mira la foto de arriba y contesta rápido:',
    dynamicPayload: {
      question: '¿Qué fue lo mejor de ese día juntos?',
      options: ['La comida deliciosa', 'Que no paramos de reírnos', 'El abrazo al final del día', '¡Todo, porque era contigo!'],
      correctIndex: 3,
      hint: 'Pista: Siempre es la misma magia.',
      rewardText: '¡Eso mismo! Y esta semana vamos a crear recuerdos aún mejores.'
    }
  },
  {
    day: 25,
    act: 'Acto IV · Cuenta Épica',
    dynamicType: 'challenge',
    teaserTitle: 'Capítulo XXV · Código de vestimenta',
    unlockedTitle: 'Prepárate para celebrar',
    suggestion: 'Empieza a crear expectativa sobre cómo debe ir vestida o qué debe tener listo para la víspera / día del cumpleaños.',
    message: 'Faltan apenas 5 días. Necesito confirmar algo muy importante contigo para el gran cierre:',
    dynamicPayload: {
      prompt: '¿Cómo quieres sentirte el día de tus 29?',
      choices: ['Elegante y espectacular en una noche inolvidable', 'Rodeada de música, brindis y mucha risa', 'Íntima, romántica y completamente consentida']
    }
  },
  {
    day: 26,
    act: 'Acto IV · Cuenta Épica',
    dynamicType: 'coupon',
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
    teaserTitle: 'Capítulo XXVII · Casi en la meta',
    unlockedTitle: 'La llave de los últimos 3 días',
    suggestion: 'Dile un código al oído en la mañana para que lo ingrese en la app durante el día.',
    message: 'Hoy no está escondido en un mueble... el código secreto de hoy te lo voy a decir yo al oído (o por nota de voz).',
    dynamicPayload: {
      riddle: 'Pregúntame o escucha la palabra secreta que te susurré hoy...',
      secretCode: 'TE AMO',
      rewardText: '¡Desbloqueado! Pista #2 del gran regalo: alista una sonrisa enorme porque viene algo inolvidable.'
    }
  },
  {
    day: 28,
    act: 'Acto IV · Cuenta Épica',
    dynamicType: 'classic',
    teaserTitle: 'Capítulo XXVIII · La víspera mágica',
    unlockedTitle: 'Mañana termina la espera...',
    suggestion: 'Un día antes del gran cierre! Hoy sube una foto tuya con un ramo o carta y prepárale el corazón para mañana.',
    message: 'Hoy es el último día de tus 28 años. Gracias por regalarme el privilegio de verte brillar un año más.\n\nMañana —cuando autorice la última cápsula y el Gran Cine de Recuerdos— vas a entender por qué guardé lo mejor para el final.\n\nDescansa lindo, mi vida.',
    dynamicPayload: {}
  },
  {
    day: 29,
    act: 'Gran Final · Tus 29',
    dynamicType: 'scratch',
    teaserTitle: 'Capítulo XXIX · Víspera del Gran Video',
    unlockedTitle: 'El Telón está por subir 🎬',
    suggestion: '¡El día previo al cumpleaños! Activa también el botón del "Gran Cine / Video Resumen" en la pestaña Cine para que vea la película de todo el mes.',
    message: 'Llegamos al capítulo 29... tu número mágico.\n\nRaspa este boleto dorado y luego ve al botón del **Cine de Recuerdos** que acabo de activar en tu pantalla principal.',
    dynamicPayload: {
      prompt: 'Raspa tu invitación al Gran Estreno',
      secretReward: '¡CINE DE RECUERDOS ACTIVADO! Sube arriba y dale play a nuestra película de estos 29 días 🎬✨'
    }
  },
  {
    day: 30,
    act: 'Gran Final · Tus 29',
    dynamicType: 'classic',
    teaserTitle: 'Capítulo XXX · ¡FELICES 29 AÑOS! 👑',
    unlockedTitle: '¡Feliz Cumpleaños #29, Amor Mío! 👑✨',
    suggestion: 'El gran día (12 de diciembre). Sube aquí el video final definitivo o la revelación completa del regalo mayor, desayuno sorpresa, flores y celebración.',
    message: '¡FELIZ CUMPLEAÑOS #29, MI PRINCESA!\n\nTreinta días, treinta latidos y un solo propósito: hacerte sentir la mujer más amada, admirada y especial del planeta.\n\nQue tus 29 años estén llenos de salud, sueños cumplidos, risas hasta llorar y momentos eternos a mi lado.\n\nHoy celebramos tu vida, amor mío. ¡Te amo con toda mi alma!',
    dynamicPayload: {}
  }
];

