/**
 * ============================================================================
 * BANCO CREATIVO DE 30 DÍAS ESCALABLES ("MEJOR CADA DÍA") + PLANES ALTERNATIVOS
 * Cada Trivia e Invitación incluye un mensaje sutil, romántico y único en pantalla por opción.
 * ============================================================================
 */

export const DYNAMIC_TYPES = {
  classic: { label: 'Carta & Recuerdo', icon: '💌', desc: 'Mensaje íntimo, fotos, video o nota de voz.' },
  scratch: { label: 'Raspa y Gana Dorado', icon: '🪙', desc: 'Tarjeta metálica dorada que raspa con su dedo para revelar el premio.' },
  trivia: { label: 'Trivia de Nosotros', icon: '🧠', desc: 'Pregunta romántica con respuesta única en pantalla para cada opción.' },
  clue: { label: 'Búsqueda del Tesoro', icon: '🕵️‍♀️', desc: 'Acertijo o pista física + palabra clave secreta para abrir el regalo.' },
  coupon: { label: 'Cupón VIP Canjeable', icon: '🎟️', desc: 'Vale dorado exclusivo con botón de "Canjear ahora".' },
  challenge: { label: 'Invitación con Misterio', icon: '✨', desc: 'Caminos ya dispuestos con certeza; ella abre un misterio sin organizar nada.' }
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
        '¡Esa risa tuya me ilumina el alma entera, princesa! Pero todavía guarda un secreto más completo… 😘',
        '¡Cuando me miras así siento que el mundo se detiene! Quédate pensando un instante más…',
        '¡Es verdad que iluminas cada espacio adonde llegas, aunque la respuesta completa guarda algo más ✨',
        '¡EXACTO, amor mío! Todo en ti me cautiva. Esta noche ya tengo preparado un antojo dulce solo para ti 🍫💖'
      ],
      correctIndex: 3,
      hint: 'Pista: ¡No podía quedarme con una sola cosa de ti!',
      rewardText: '¡Acertaste, amor mío! Esta noche ya tengo preparado un antojo dulce solo para ti 🍫💖'
    }
  },
  {
    day: 3,
    act: 'Acto I · La Chispa',
    dynamicType: 'scratch',
    allowReply: false,
    hasSunflowers: true,
    teaserTitle: 'Capítulo III · Un secreto entre girasoles 🌻',
    unlockedTitle: 'Un capricho dorado para mi princesa 🌻',
    suggestion: 'Este día incluye girasoles especiales 🌻 en pantalla. Sube una selfie linda de ambos y sorpréndela con una cena o detalle ya reservado.',
    message: 'Hoy no hace falta pensar en nada… solo desliza tu dedo sobre el oro para descubrir lo que ya preparé para ti.',
    dynamicPayload: {
      prompt: 'Desliza tu dedo sobre el oro para revelarlo',
      secretReward: 'Esta semana ya tienes reservada una velada especial con tu plato favorito, pensada de principio a fin solo para ti 🍷✨'
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
    teaserTitle: 'Capítulo V · Todo está preparado para ti',
    unlockedTitle: 'Un fin de semana pensado solo para ti',
    suggestion: 'Cada opción transmite certeza total de que ya tienes todo organizado y listo para ella, invitándola a descubrir qué ambiente abrir primero.',
    message: 'Este fin de semana no tienes que pensar ni organizar nada, amor mío.\n\nTodo está pensado, reservado y listo para ti. Solo elige qué atmósfera deseas descubrir primero:',
    dynamicPayload: {
      prompt: 'Todo ya está dispuesto para nosotros… ¿qué experiencia deseas abrir primero?',
      choices: [
        'Velada I · Luces suaves, un brindis especial y música hecha para nosotros',
        'Velada II · Nuestro refugio íntimo, aroma cálido y el mundo en pausa',
        'Sorpresa Total · Déjame llevarte sin decirte el destino'
      ],
      choiceFeedbacks: [
        '¡Reserva confirmada, mi princesa! Tú solo prepárate para brillar, que de cada detalle ya me encargué yo ✨🥂',
        '¡Todo está listo en nuestro rincón secreto! Solo ven a mis brazos y déjate consentir sin mirar el reloj 💖🕯️',
        '¡Me encanta cuando te dejas sorprender! El lugar, la música y el instante exacto ya esperan por nosotros ✨🌙'
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
    unlockedTitle: 'Un respiro dorado solo para ti',
    suggestion: 'Cierra la primera semana haciéndole sentir que todo está resuelto y listo para consentirla de verdad.',
    message: 'Completamos los primeros siete capítulos, amor mío. Hoy quiero que descanses tranquila mientras yo me encargo de absolutamente todo.',
    dynamicPayload: {
      couponTitle: 'TARDE DE CALMA & MIMO ABSOLUTO',
      couponDesc: 'Todo está dispuesto: masaje tibio, tu música favorita de fondo y el resto del día resuelto por mí para ti.'
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
      prompt: 'Descubre qué ya viene en camino hoy',
      secretReward: '¡Hoy ya viene en camino tu café y postre favorito para endulzar tu mañana en el instante exacto ☕🍰!'
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
    suggestion: 'Trivia sobre una escapada juntos; personaliza las 4 respuestas con detalles especiales suyos.',
    message: '¡Llegamos al día 10! Veamos qué tan conectada estás con lo que ya estoy preparando:',
    dynamicPayload: {
      question: 'Si nos escapáramos hoy mismo a un lugar los dos solos, ¿qué no puede faltar en la maleta?',
      options: [
        'Tu cámara y nuestra música',
        'Ropa cómoda y un detalle para brindar',
        'Ganas de perdernos sin mirar el reloj',
        '¡Todo eso junto contigo!'
      ],
      optionFeedbacks: [
        '¡Nuestra música y fotos siempre nos acompañan! Aunque todavía guarda un secreto más…',
        '¡Un detalle así nunca falla! Aun así falta la respuesta completa 😘',
        '¡Desconectarnos del mundo es la mejor parte! Pero mira la última opción ✨',
        '¡SÍ, amor mío! Contigo todo se multiplica. Ya estoy preparando una escapada especial para nosotros antes de tus 29 ✈️💖'
      ],
      correctIndex: 3,
      hint: 'Pista: ¡Contigo todo se suma!',
      rewardText: '¡Exacto! Ya estoy preparando una escapada especial antes de tus 29.'
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
    suggestion: 'Puedes dejar estas 11 razones o personalizar cada una con gestos reales suyos (su risa, su voz, su valentía).',
    message: 'Hoy es capítulo 11, y aquí te dejo once verdades que guardo siempre en el corazón:\n1. La luz con la que iluminas cualquier lugar.\n2. Tu valentía inmensa para alcanzar cada sueño.\n3. La paz infinita que siento cuando me abrazas.\n4. La dulzura que pones incluso en los días difíciles.\n5. Tu mirada honesta cuando me hablas de frente.\n6. Esa risa tuya que borra cualquier cansancio.\n7. La forma tan tuya de cuidar a quienes amas.\n8. Tu fuerza silenciosa que admiro cada día.\n9. La complicidad con la que nos entendemos sin hablar.\n10. Cómo haces que un día cualquiera parezca inolvidable.\n11. El privilegio de caminar la vida tomado de tu mano.',
    dynamicPayload: {}
  },
  {
    day: 12,
    act: 'Acto II · Complicidad',
    dynamicType: 'challenge',
    allowReply: true,
    hasSunflowers: false,
    teaserTitle: 'Capítulo XII · Un deseo guardado en oro',
    unlockedTitle: 'Un anhelo pensado para tus 29',
    suggestion: 'Trae caja opcional de respuesta, sin pedirle que organice nada: cada camino ya tiene una sorpresa reservada.',
    message: 'Quiero ser tu cómplice en todo lo que sueñas para este nuevo año de vida.\n\nNo tienes que planear ni pedir nada: ya tengo sorpresas dispuestas en cada uno de estos caminos. Elige cuál deseas ver florecer primero:',
    dynamicPayload: {
      prompt: '¿Qué ilusión te gustaría sentir hecha realidad junto a mí?',
      choices: [
        'Una escapada a un lugar nuevo para perdernos los dos',
        'Una experiencia distinta que quede grabada en nuestra memoria',
        'Un momento dedicado por completo a tu paz y bienestar'
      ],
      choiceFeedbacks: [
        '¡Hecho, viajera mía! Ya guardo ese rumbo en mente para llevarte sin que tengas que preocuparte por nada ✈️🌍',
        '¡Promesa sellada! Yo me encargo de hacer realidad un recuerdo inolvidable para nosotros ✨💫',
        '¡Te mereces el cielo entero, amor mío! Todo quedará dispuesto para que solo descanses y disfrutes 💐💖'
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
    suggestion: 'Invítala a arreglarse bonita para una tarde de fotos ya organizada al atardecer (esas fotos alimentan el video final).',
    message: 'Porque mereces sentirte única y radiante en cada instante… todo ya está coordinado para nuestra tarde.',
    dynamicPayload: {
      couponTitle: 'TARDE DE FOTOS & BRINDIS AL ATARDECER',
      couponDesc: 'Hoy la luz del atardecer ya tiene cita con nosotros: todo está listo para capturar recuerdos hermosos y brindar juntos.'
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
    suggestion: 'Ten ya listas las entradas o la velada privada en casa para que ella sienta que solo debe llegar y disfrutar.',
    message: 'Raspa este boleto dorado para descubrir la velada que ya está preparada para ti esta noche:',
    dynamicPayload: {
      prompt: 'Raspa tu entrada privada',
      secretReward: 'Esta noche tu función especial ya está lista: cine o velada privada en casa con todos tus detalles favoritos preparados 🍿🥂'
    }
  },
  {
    day: 17,
    act: 'Acto III · Adrenalina',
    dynamicType: 'trivia',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo XVII · Complicidad en secreto',
    unlockedTitle: 'Un pequeño secreto entre nosotros',
    suggestion: 'Cada opción tiene una respuesta romántica, sutil y distinta en pantalla.',
    message: 'Hay instantes contigo que se quedan conmigo todo el día… veamos si adivinas cuál me desarma más:',
    dynamicPayload: {
      question: '¿Qué detalle tuyo logra desarmarme en cuestión de segundos?',
      options: [
        'Tu aroma suave cuando te acercas a abrazarme',
        'El brillo de tus ojos cuando te ríes conmigo',
        'Esa sonrisa cómplice que solo me regalas a mí',
        'Todo en ti… no puedo resistirme a nada tuyo'
      ],
      optionFeedbacks: [
        '¡Ese perfume tuyo me envuelve por completo! Pero hay algo todavía más cierto 😘',
        '¡Tu risa es mi melodía favorita en el mundo! Sigue mirando con atención…',
        '¡Esa mirada tuya detiene mi mundo entero! Aunque falta la respuesta completa 😉',
        '¡Me conoces demasiado bien, amor mío! Y esta noche me encargo de demostrártelo con diez besos sin prisa 💋✨'
      ],
      correctIndex: 3,
      hint: 'Pista: ¡Es todo lo que eres!',
      rewardText: '¡Acertaste! Esta noche tengo diez besos sin prisa esperando solo por ti 💋✨'
    }
  },
  {
    day: 18,
    act: 'Acto III · Adrenalina',
    dynamicType: 'challenge',
    allowReply: false,
    hasSunflowers: false,
    teaserTitle: 'Capítulo XVIII · Una mesa reservada en secreto',
    unlockedTitle: 'Tu cena especial de esta noche',
    suggestion: 'Transmítele certeza de que la noche entera ya está resuelta y reservada; ella solo descubre qué atmósfera abrir primero.',
    message: 'Esta noche todo está listo para nosotros, mi princesa. No tienes que pensar en nada: la mesa, la luz y los sabores ya tienen lugar.\n\nSolo toca la esencia con la que quieres dejarte sorprender hoy:',
    dynamicPayload: {
      prompt: 'Todo está reservado… ¿qué aroma deseas que reciba nuestra noche?',
      choices: [
        'Encanto italiano · Luz de velas, vino y sabores clásicos',
        'Noche exótica · Sabores orientales y brindis bajo tenues luces',
        'Velada íntima · Cortes especiales, música suave y el tiempo nuestro'
      ],
      choiceFeedbacks: [
        '¡La mesa ya nos espera! Ven preciosa, que esta noche de velas y vino es toda nuestra 🍷🕯️',
        '¡Encanto reservado! Todo está coordinado para sorprender tu paladar esta noche ✨🥂',
        '¡Todo listo para una velada inolvidable! Tú solo déjate llevar desde que crucemos la puerta 💖🌙'
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
    unlockedTitle: 'Pase de belleza y descanso total',
    suggestion: 'Regálale uñas, spa, peluquería o un kit de skincare antes de la semana final para que brille en su cumple.',
    message: 'Faltan solo diez capítulos para tu gran día y ya dejé todo listo para consentirte como la reina que eres.',
    dynamicPayload: {
      couponTitle: 'PASAPORTE BEAUTY & SPA',
      couponDesc: 'Todo está dispuesto para consentirte con calma (uñas, spa o tu ritual favorito) antes de tu noche de los 29 ✨'
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
    message: 'Mira la foto de arriba y responde con el corazón:',
    dynamicPayload: {
      question: '¿Qué fue lo mejor de ese instante juntos?',
      options: [
        'Cada detalle que compartimos en la mesa',
        'El brillo de nuestras risas sin mirar el reloj',
        'El abrazo eterno al final del día',
        '¡Todo, porque era contigo!'
      ],
      optionFeedbacks: [
        '¡Fue delicioso compartirlo contigo! Aunque hubo algo todavía más especial 😘',
        '¡Esas risas nuestras no las cambio por nada! Sigue mirando con calma…',
        '¡Ese abrazo me llenó el alma entera! Mira la última opción 😉',
        '¡Exactamente, mi princesa! Contigo hasta un instante sencillo se vuelve eterno 💖'
      ],
      correctIndex: 3,
      hint: 'Pista: Siempre es la misma magia.',
      rewardText: '¡Eso mismo! Y esta semana crearemos recuerdos todavía más inolvidables.'
    }
  },
  {
    day: 25,
    act: 'Acto IV · Cuenta Épica',
    dynamicType: 'challenge',
    allowReply: true,
    hasSunflowers: false,
    teaserTitle: 'Capítulo XXV · La antesala de tus 29',
    unlockedTitle: 'Todo listo para tu noche dorada',
    suggestion: 'Aumenta la emoción del gran día haciéndole sentir que cada detalle de la celebración ya está cubierto y reservado.',
    message: 'Faltan apenas unos suspiros para tu 12 de diciembre, y cada detalle de tu celebración ya está cuidadosamente preparado para ti.\n\nElige cuál de estas sensaciones quieres sentir primero cuando comience tu gran noche:',
    dynamicPayload: {
      prompt: 'Tu noche de los 29 ya está escrita en oro… ¿qué instante deseas abrir primero?',
      choices: [
        'Elegancia absoluta · Un vestido especial, brindis y miradas cómplices',
        'Alegría infinita · Nuestra música favorita, luz dorada y tu sonrisa',
        'Amor en estado puro · Abrazos largos, calma y magia solo nuestra'
      ],
      choiceFeedbacks: [
        '¡Así será, reina mía! Tu lugar y cada detalle ya aguardan para verte brillar como nunca ✨👑',
        '¡Todo está preparado para escuchar tu risa llenarlo todo! Será una noche eterna 🥂🎶',
        '¡Cada instante está pensado para hacerte sentir la mujer más amada del mundo! 💖✨'
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
    message: 'Llegamos al capítulo 29... tu número mágico.\n\nRaspa este boleto dorado y luego mira el botón del Cine de Recuerdos en tu pantalla principal.',
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
    teaserTitle: 'Capítulo II · Tres secretos listos para ti',
    unlockedTitle: 'Un detalle reservado para tu día',
    suggestion: 'Plan B Día 2: En lugar de Trivia, dale a elegir entre 3 gestos que ya tienes listos para entregarle hoy.',
    message: 'Hoy no tienes que pensar en nada, mi princesa: ya dejé listos tres gestos distintos para consentirte. Elige cuál quieres descubrir primero:',
    dynamicPayload: {
      prompt: 'Todo está preparado para tu tarde… toca el secreto que quieras abrir hoy:',
      choices: [
        'Un detalle dulce guardado especialmente para ti',
        'Tu bebida favorita preparada con calma para ti',
        'Un abrazo sin prisa y una sorpresa en mis manos'
      ],
      choiceFeedbacks: [
        '¡Concedido, amor mío! Tu detalle dulce ya está reservado y en camino hacia ti 🍫💖',
        '¡Todo listo! Tu bebida favorita llegará hoy para iluminar tu tarde ☕✨',
        '¡Qué elección tan hermosa! Hoy te espera un abrazo eterno y mi sorpresa lista para ti 🤗💛'
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
        question: '¿Cuál de estos instantes conmigo guardarías para siempre?',
        options: [
          'Una tarde de risas sin mirar el reloj',
          'Una velada romántica solo nosotros dos',
          'Un camino juntos con nuestra música sonando',
          '¡Cualquiera mientras estemos juntos!'
        ],
        optionFeedbacks: [
          '¡Reír contigo es mi paz favorita! Pero hay una respuesta todavía más cierta 😘',
          '¡Con una copa y mirándote a los ojos! Mira la última opción…',
          '¡Cantando juntos por carretera! Aun así falta la ganadora 😉',
          '¡Exacto, amor mío! Contigo hasta el instante más sencillo se vuelve magia ✨💖'
        ],
        correctIndex: 3,
        hint: 'Pista: ¡Lo importante siempre es el "contigo"!',
        rewardText: '¡Acertaste! Nuestro próximo momento especial ya está en preparación 💖'
      }
    };
  }
  if (altType === 'challenge') {
    return {
      ...base,
      dynamicType: 'challenge',
      suggestion: 'Plan B (Invitación con Misterio): Tres caminos ya dispuestos con certeza para que ella elija qué descubrir primero.',
      dynamicPayload: {
        prompt: 'Hoy todo ya está dispuesto para ti… ¿qué detalle deseas descubrir primero?',
        choices: [
          'Un detalle dulce pensado para tu tarde',
          'Nuestra música y un abrazo que detenga el reloj',
          'Una salida sorpresa completamente organizada'
        ],
        choiceFeedbacks: [
          '¡Todo listo, mi princesa! Tu detalle dulce ya viene en camino para ti 🍫✨',
          '¡Nuestra música y ese abrazo largo ya esperan por ti esta noche! 🎶🤗',
          '¡Todo reservado! Tú solo déjate llevar que de principio a fin me encargo yo ✨🌙'
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
