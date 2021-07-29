<script>
  import { Fullpage, FullpageSection, FullpageSlide } from "svelte-fullpage";
  import { Container, Row, Col } from "sveltestrap";
  import { Tabs, Tab, TabList, TabPanel } from "svelte-tabs";
  import Content from "./Content.svelte";

  import * as code from "./code.js";
  import Counter from "./examples/Counter.svelte";
  import Structure from "./examples/Structure.svelte";
  import TwoWayBinding from "./examples/TwoWayBinding.svelte";
  import ComponentsOuter from "./examples/ComponentsOuter.svelte";
  import Motion from "./examples/Motion.svelte";
  import Example from "./Example.svelte";
  import Templates from "./examples/Templates.svelte";
  //Include all titles of your sections, this is also used as number that indicate count of sections
  const sections = [
    "WhatIsSvelte",
    "Advantages",
    "Disadvantages",
    "Code",
    "Sapper",
  ];
  //Have to set to 0 (or section you wish to display as default), otherwise section will not display
  let activeSection = 0;
  //Same mechanics as in sections
  const slides = [
    "Compiler vs. Virtuelles DOM",
    "Leichtgewichtig & Performant",
    "Weniger Boilerplate",
    "Wirklich reaktiv",
    "Niedrige Lernkurve",
    "Komponenten-Muster",
    "Eingebaute Animationen und Effekte",
    "Eingebauter reaktiver Speicher",
    "Mehrere Ausgabeziele",
  ];

  //Also has to be 0 or specific id of slide
  let activeSlide = 0;

  let long = false;
</script>

<svelte:head>
  <title>Präsentation</title>
</svelte:head>


<label class="switch" id="enable_long" >
  <input type="checkbox" bind:checked={long} >
  <span class="slider round"></span>
</label>


<Fullpage bind:activeSection arrows drag transitionDuration="10">
  <FullpageSection center>
    <Container class="text-center">
      <Row>
        <Col>
          <div class="header-container">
            <h1 class="title">SVELTE</h1>
            <p class="subheader">Cybernetically enhanced web apps</p>
            <p>
              Leon Kowarschick (Mtrk. Nachname), Nils Mangold (202477), Philipp
              Walter (203149)
            </p>

            <div id="parallelogram" />
          </div>
        </Col>
      </Row>
    </Container>
  </FullpageSection>
  <FullpageSection center>
    <Container class="text-center">
      <Row>
        <Col>
          <div class="block-middle">
            <h1>
              Was ist <span class="svelte-color">Svelte</span> ?
            </h1>
            <Content {long}>
              <div slot="long">
                <p>
                  Svelte ist ein Komponenten-Framework - wie React oder Vue - aber mit einem wichtigen Unterschied. Traditionelle Frameworks erlauben es Ihnen, deklarativen zustandsgesteuerten Code zu schreiben, aber es gibt einen Nachteil: Der Browser muss zusätzliche Arbeit leisten, um diese deklarativen Strukturen in DOM-Operationen umzuwandeln, wobei Techniken wie diese Ihr Frame-Budget auffressen und den Garbage Collector belasten.               
                </p>
                <p>
                  Stattdessen läuft Svelte zur Build-Zeit und konvertiert Ihre Komponenten in hocheffizienten imperativen Code, der das DOM chirurgisch aktualisiert. Das Ergebnis ist, dass Sie in der Lage sind, anspruchsvolle Anwendungen mit hervorragenden Leistungsmerkmalen zu schreiben.
                </p>
              </div>
              <div slot="short">
                <p>
                  Komponenten-Framework 
                  <br/> Es ist ein Compiler, der Ihre deklarativen Komponenten in effizientes JavaScript umwandelt, das das DOM aktualisiert.
                  <br/> Reaktives UI-Konzept
                </p>
              </div>
            </Content>
          </div>
        </Col>
      </Row>
    </Container>
  </FullpageSection>
  <FullpageSection center>
    <Container class="text-center">
      <Row>
        <Col>
          <h1 class="title-section">VORTEILE</h1>
          <div id="parallelogram" />
        </Col>
      </Row>
    </Container>
  </FullpageSection>
  <FullpageSection center>
    <Container class="text-center">
      <Row>
        <Col>
          <div>
            <div class="number-title">1</div>
            <h1>
              Compiler vs. <span class="svelte-color">Virtuelles DOM</span>
            </h1>
            <Content {long}>
              <p slot="long">
                Ein Compiler zu sein und das VirtualDOM loszuwerden ist der
                wichtigste Vorteil von Svelte, der viele der anderen Vorteile
                ermöglicht, die wir weiter unten sehen werden. Das Konzept erfreut
                sich so großer Beliebtheit, dass Angular und Ember in ihren
                jüngsten Versionen auf Compiler umgestellt haben.
              </p>
            </Content>
          </div>
        </Col>
        <Col>
          <div>
            <div class="number-title">2</div>
            <h1>
              Leichtgewichtig & <span class="svelte-color">Performant</span>
            </h1>

            <Content {long}>
              <p slot="long">
              Svelte erzeugt hochoptimiertes Vanilla JS mit einem sehr geringen
              Overhead zur Laufzeit. Das bedeutet kleine Bundle-Größen, einen
              geringen Speicherbedarf und eine schnell ladende und schnell
              laufende Anwendung. Schauen Sie sich die Performance-Benchmarks
              hier an, um den Unterschied zu sehen. All dies ist "out of the
              box", ohne dass Sie irgendwelche Einstellungen vornehmen müssen,
              und es gibt viele Möglichkeiten, die Leistung noch weiter zu
              verbessern.
            </p>
          </Content>
          </div>
        </Col>
      </Row>
    </Container>
  </FullpageSection>
  <FullpageSection center>
    <Container class="text-center">
      <Row>
        <Col>
          <div>
            <div class="number-title">3</div>
            <h1>
              Weniger <span class="svelte-color">Boilerplate</span>
            </h1>
            <Content {long}>
              <p slot="long">
              Mit Svelte gibt es keine Notwendigkeit für das Hinzufügen von Glue
              Code wie Hooks oder komplexes State Management und so weiter. Die
              Boilerplate, die für Komponenten benötigt wird, ist sehr minimal
              und kommt fast an Vanilla HTML/JS heran. Svelte unterstützt auch
              optionale Zwei-Wege-Bindungen, die es einfacher machen, Formulare
              zu erstellen.
              </p>
            </Content>
          </div>
        </Col>
        <Col>
          <div>
            <div class="number-title">4</div>
            <h1>
              Wirklich <span class="svelte-color">reaktiv</span>
            </h1>
            <Content {long}>
              <p slot="long">
              Svelte ist standardmäßig reaktiv. Das DOM wird automatisch bei
              Zustandsänderungen in jeder Top-Level-Variablen einer Komponente
              aktualisiert. Sie müssen dafür nicht einmal speziellen Code
              hinzufügen. Nur direkte Top-Level-Zuweisungen funktionieren auf
              diese Weise und Referenzmutationen wie array.push funktionieren
              nicht. Das bedeutet, dass Mutationen meiner Meinung nach
              expliziter und einfacher zu verstehen sind.
            </p>
            </Content>
          </div>
        </Col>
      </Row>
    </Container>
  </FullpageSection>
  <FullpageSection center>
    <Container class="text-center">
      <Row>
        <Col>
          <div>
            <div class="number-title">5</div>
            <h1>
              Mehrere <span class="svelte-color">Ausgabeziele</span>
            </h1>
            <Content {long}>
              <p slot="long">
              Da es sich um einen Compiler handelt, ist es einfach, die
              Ausgabeziele zu ändern, ohne den Code Ihrer Komponente ändern zu
              müssen. Zum Beispiel unterstützt Svelte das serverseitige
              Rendering von Haus aus, indem es einen Compiler-Modus dafür
              bereitstellt (dom vs. ssr). Es gibt sogar eine
              NativeScript-Integration für Svelte, die von dieser Flexibilität
              Gebrauch macht, um Ziele jenseits von dom und ssr zu erzeugen. Es
              gibt auch das Sapper-Framework, bald SvelteKit, vom Svelte-Team,
              das ähnlich wie Next.js ist, aber für die Philosophie von Svelte
              optimiert ist. Sapper unterstützt SSR, Progressive Web Apps,
              Code-Splitting, und so weiter.
            </p>
            </Content>
          </div>
        </Col>
        <Col>
          <div>
            <div class="number-title">6</div>
            <h1>
              Komponenten-<span class="svelte-color">Muster</span>
            </h1>
            <Content {long}>
              <p slot="long">
              Svelte folgt einem Component-First-Pattern, was es ideal für die
              Erstellung neuer Webanwendungen oder für das Hinzufügen von
              Webkomponenten zu bestehenden Anwendungen macht. Stile sind
              standardmäßig auf Komponenten skaliert, was Svelte ideal für
              Web-Komponenten macht.
            </p>
            </Content>
          </div>
        </Col>
      </Row>
    </Container>
  </FullpageSection>
  <FullpageSection center>
    <Container class="text-center">
      <Row>
        <Col>
          <div>
            <div class="number-title">7</div>
            <h1>
              Eingebaute Animationen und <span class="svelte-color"
                >Effekte</span
              >
            </h1>
            <Content {long}>
              <p slot="long">
              Svelte bietet eingebaute Animationen und Effekte, die es einfacher
              machen, glatte Benutzeroberflächen und interaktive
              Visualisierungen zu erstellen. Nun, das Framework wurde
              ursprünglich für die Erstellung interaktiver Grafiken für The
              Guardian entwickelt. Dieser Ansatz bietet eine viel schönere
              Entwicklererfahrung als etwas wie React und ist viel einfacher zu
              verwenden.
            </p>
            </Content>
          </div>
        </Col>
        <Col>
          <div>
            <div class="number-title">8</div>
            <h1>
              Eingebauter reaktiver <span class="svelte-color">Speicher</span>
            </h1>
            <Content {long}>
              <p slot="long">
              Svelte bietet sowohl veränderliche als auch unveränderliche
              reaktive Speicher, die es einfacher machen, komplexere
              Zustandsverwaltung in Ihrer Anwendung durchzuführen. Die Stores
              unterstützen manuelle und automatische Subskriptionen und
              bidirektionale Bindungen, was sie sehr flexibel macht. Die
              Implementierung ermöglicht auch den Wechsel zu einer anderen
              Zustandsverwaltungslösung wie z. B. RxJS.
            </p>
            </Content>
          </div>
        </Col>
      </Row>
    </Container>
  </FullpageSection>
  <FullpageSection center>
    <Container class="text-center">
      <Row>
        <Col>
          <div>
            <div class="number-title">9</div>
            <h1>
              Niedrige <span class="svelte-color">Lernkurve</span>
            </h1>
            <Content {long}>
              <p slot="long">
              Im Gegensatz zu React oder Angular ist die Lernkurve für Svelte
              recht niedrig. Es gibt keine spezielle Syntax wie JSX zu lernen
              oder komplexe APIs wie bei Angular, die man sich merken muss.
              Alles ist in standardkonformem JS/TS, CSS und HTML geschrieben,
              mit etwas zusätzlichem Syntaxzucker für Direktiven und
              Template-Logik. Die Komponenten-API ist einfach und überschaubar.
              Die Dokumentation ist ebenfalls sehr gut und leicht
              nachvollziehbar. Ich habe zum Beispiel nur ein paar Tage
              gebraucht, um mich mit Svelte vertraut zu machen, selbst für
              fortgeschrittene Konzepte wie Lebenszyklen, Komposition und so
              weiter. Im Gegensatz dazu hat es Monate gedauert, bis ich mich in
              React wirklich zurechtgefunden habe und ich kenne immer noch nicht
              einmal die Hälfte der Angular-APIs, nachdem ich es fast ein Jahr
              lang benutzt habe. Natürlich hilft die Kenntnis von React oder
              Angular dabei, Svelte leichter zu erlernen, da es eine Menge
              ähnlicher Konzepte gibt.
            </p>
            </Content>
          </div>
        </Col>
      </Row>
    </Container>
  </FullpageSection>
  <FullpageSection center>
    <Container class="text-center">
      <Row>
        <Col>
          <h1 class="title-section">NACHTEILE</h1>
          <div id="parallelogram" />
        </Col>
      </Row>
    </Container>
  </FullpageSection>
  <FullpageSection center>
    <Container class="text-center">
      <Row>
        <Col>
          <div>
            <div class="number-title">1</div>
            <h1>
              Junges <span class="svelte-color">Framework</span>
            </h1>
            <Content {long}>
              <p slot="long">
              Svelte ist sehr jung und das bedeutet, dass es noch nicht so
              kampferprobt ist wie React oder Angular und Sie vielleicht
              manchmal gegen einige Mauern laufen. Das bedeutet, dass es
              wahrscheinlich nicht für sehr komplexe oder unternehmenskritische
              Anwendungen geeignet ist, von denen erwartet wird, dass sie
              skalieren. Dies könnte kein langfristiges Problem sein, da das
              Framework in seiner Popularität explodiert und die Einführung von
              Sapper bei den Skalierungsproblemen geholfen hat. Allerdings hätte
              die Verwirrung um Sapper vs. SvelteKit meiner Meinung nach
              vermieden werden können.
            </p>
            </Content>
          </div>
        </Col>
        <Col>
          <div>
            <div class="number-title">2</div>
            <h1>
              Kleinere Community und <span class="svelte-color"
                >kleineres Ökosystem</span
              >
            </h1>
            <Content {long}>
              <p slot="long">
              Ein junges Framework zu sein bedeutet, dass es eine kleinere
              Community und Benutzerbasis sowie ein kleineres Ökosystem hat.
              Daher finden Sie vielleicht nicht so viele Tools oder Bibliotheken
              wie in React oder so viel Hilfe auf Stack Overflow, wenn Sie bei
              einem komplexen Problem nicht weiterkommen.
            </p>
            </Content>
          </div>
        </Col>
      </Row>
    </Container>
  </FullpageSection>
  <FullpageSection center>
    <Container class="text-center">
      <Row>
        <Col>
          <div>
            <div class="number-title">3</div>
            <h1>
              Compilation <span class="svelte-color">heavy</span>
            </h1>
            <Content {long}>
              <p slot="long">
              Wenn Sie wie ich schon eine Weile im Bereich der
              Frontend-Entwicklung tätig sind, können Sie zurückblicken und
              sehen, dass sich die UX meilenweit verbessert hat, aber die
              Toolchain, um das zu produzieren, ist sehr komplex geworden. Bei
              JHipster versuchen wir zum Beispiel, das klassenbeste
              Production-Grade-Setup für eine Full-Stack-Web-App mit
              React/Vue/Angular-Frontend und Java/Kotlin/.NET/NodeJS-Backend
              anzubieten. Wenn Sie eine neue App erstellen und kompilieren,
              werden Sie feststellen, dass das Frontend 10x mehr Zeit zum
              Kompilieren benötigt als das Backend. Das ist heutzutage das neue
              Normal in jeder Full-Stack-Web-Applikation und auch Svelte hat das
              gleiche Problem. Es ist Compiler-lastig und je komplexer Ihre App
              wird, desto komplexer und zeitaufwändiger wird der Build. Das
              bedeutet auch, dass man nicht einfach eine JS-Datei in eine
              Webseite einfügen kann und erwarten kann, dass es eine Svelte-App
              wird, wie man es mit Vue machen kann.
            </p>
            </Content>
          </div>
        </Col>
        <Col>
          <div>
            <div class="number-title">4</div>
            <h1>
              Mac<span class="svelte-color">ken</span>
            </h1>
            <Content {long}>
              <p slot="long">
              Svelte ist konform mit den Webstandards, es führt nichts Neues wie
              JSX ein. Aber es ändert einige der Standard-Semantiken, um auf
              eine andere Art und Weise zu arbeiten und das könnte für neue
              Benutzer verwirrend sein. Zum Beispiel verwendet es das
              Schlüsselwort export anders und es gibt Macken wie die Verwendung
              von on:click statt onClick und so weiter. Aber diese sind in jedem
              Framework fast unvermeidbar. Es verwendet auch ein JS-Label ($:),
              damit abgeleitete Anweisungen/Deklarationen funktionieren. Das
              könnte befremdlich wirken, da einige JS-Entwickler wahrscheinlich
              nicht einmal wissen, dass Labels in JS existieren, da wir sie
              selten verwenden.
            </p>
            </Content>
          </div>
        </Col>
      </Row>
    </Container>
  </FullpageSection>
  <FullpageSection center>
    <Container class="text-center">
      <Row>
        <Col>
          <h1 class="title-section">Sapper</h1>
          <div id="parallelogram" />
        </Col>
      </Row>
    </Container>
  </FullpageSection>
  <FullpageSection center>
    <Container class="text-center">
      <Row>
        <Col>
          <h1>Was ist <span class="sapper-color">Sapper?</span></h1>
          <Content {long}>
            <div slot="long">
              <p>
                Sapper ist ein app framework oder auch metaframework aufbauend
                auf Svelte. Die Aufgabe von Sapper ist es, das Bauen von Svelte
                Apps so einfach wie möglich zu gestalten in der Entwicklung von
                modernen best practice Applikationen. Diese best practice
                Applikationen enthalten beispielsweise server side rendering
                (SSR) und code-splitting. Sapper nutzt zudem eine
                “filesystem-based routing” wie von Next.js bekannt gemacht. Es
                gibt zwei grundlegenden Konzepte: jede Seite einer App ist eine
                Svelte Komponentet man erstellt Seiten in dem mal Dateien zu
                src/routes hinzufügt. Diese werden vom server gerendert sodass
                der initiale Besuch des Users so schnell wie möglich ist. HTML
                im Browser wird eine SPA Single Page Application html templates
                können geprerendert werden auf node server → optimierung von SEO
                Search Engine Optimization svelte ohne sapper: anfrage zu
                mysite.com/about → server about server → empty html page with
                svelte js bundle und about component rendered in browser mit
                sapper: mysite.com/about → server der about component
                pr-rendered on server und dann prerendered html und compiled js
                bundle an browser schickt nur initiale Anfrage nutzt Server Side
                rendering, sonst render im browser direkt. Alle weiteren Quelles
                und Anfragen werden vom frontend java script bundle gehandelt
                und dynamisch anzeigen von Komponenten.
              </p>
            </div>
            <div slot="short">
              <ul>
                <li>
                  Auf Svelte aufbauendes Metaframework für "best practice"
                  Applikationen
                </li>
                <li>Server Side Rendering (SSR)</li>
                <li>Code Splitting</li>
                <li>Ähnlich wie bei Next.js Filesystem-based routing</li>
                <li>Zwei grundlegende Konzepte</li>
                <li>jede Seite einer App ist eine Svelte Komponentet</li>
                <li>
                  man erstellt Seiten in dem mal Dateien zu src/routes
                  hinzufügt. Diese werden vom server gerendert sodass der
                  initiale Besuch des Users so schnell wie möglich ist.
                </li>
                <li>HTML wird im Browser zu Single Page Applikation (SPA)</li>
                <li>
                  durch prerender von html templates, Optimierung von Search
                  Engine Optimization (SEO)
                </li>
                <li>
                  Nur initiale Anfrage nutzt Server Side rendering, sonst im
                  Browser direkt gerendert
                </li>
              </ul>
            </div>
          </Content>
        </Col>
      </Row>
    </Container>
  </FullpageSection>
  <FullpageSection center>
    <Container class="text-center">
      <Row>
        <Col>
          <div>
            <h1>Warum <span class="sapper-color">Sapper?</span></h1>
            <Content {long}>
              <div slot="long">
                <p>
                  Der Name Sapper stammt vom Militär. Zu deutsch Sappeur vom
                  französischen sapeur Steinhauer abgeleitet. Ein Sappeur war
                  ein Belagerungspionier oder Truppenhandwerker. Tätigkeiten
                  waren beispielsweise Brückenbau, Straßenbau/Reparaturen alles
                  unter Kriegsbedingungen. Sapper, was kurz für Svelte App maker
                  steht ist ein mutiger und pflichtbewusster Verbündeter wenn es
                  um die Herausforderungen der Webentwicklung geht. Für
                  Webentwickler sind beispielsweise schwache Geräte, schlechte
                  Netzwerkverbindungen und Komplexität in der Frontend
                  Entwicklung Herausforderungen.
                </p>
              </div>
              <div slot="short">
                <ul>
                  <li>Name stammt vom Militär engl. Sapper deutsch Sappeur</li>
                  <li>
                    Soldaten im Kriegsgebiet für Brücken und
                    Straßenbau/Brückenbau
                  </li>
                  <li>Sapper kurz für Svelte App maker</li>
                </ul>
              </div>
            </Content>
          </div>
        </Col>
        <Col>
          <div>
            <h1>
              Vergleich <span class="sapper-color">Next.js</span>
            </h1>
            <Content {long}>
              <div slot="long">
                <p>
                  wie Next.js für React ist Sapper für Svelte Unterschiede
                  zwischen Sapper und Next.js: - Sapper wird betrieben von
                  Svelte statt React und ist somit schneller und die Apps sind
                  kleiner - Seiten und Routen im src/routes Verzeichnis machen
                  es sehr einfach eine JSON API hizuzufügen - Quelles sind nur
                  ein a-tag Element im Gegensatz zu einer frameworkspezifischen
                  Quelle-tag Komponente
                </p>
              </div>
              <div slot="short">
                <ul>
                  <li>
                    Sapper wird betrieben von Svelte statt React und ist somit
                    schneller und die Apps sind kleiner
                  </li>
                  <li>
                    Seiten und Routen im src/routes Verzeichnis machen es sehr
                    einfach eine JSON API hizuzufügen
                  </li>
                  <li>
                    Quelles sind nur ein a-tag Element im Gegensatz zu einer
                    frameworkspezifischen Quelle-tag Komponente
                  </li>
                </ul>
              </div>
            </Content>
          </div>
        </Col>
      </Row>
    </Container>
  </FullpageSection>
  <FullpageSection center>
    <Container class="text-center">
      <Row>
        <Col>
          <h1 class="title-section">Zukunftsausblick</h1>
          <div id="parallelogram" />
        </Col>
      </Row>
    </Container>
  </FullpageSection>
  <FullpageSection center>
    <Container class="text-center">
      <Row>
        <Col>
          <div>
            <h1>Warum <span class="svelte-color">SvelteKit?</span></h1>
            <Content {long}>
              <div slot="long">
                <p>
                  Vor allem für Einsteiger ist der Unterschied von zwei
                  empfohlenen Wegen eine App zu starten sehr verwirrend. Auf der
                  einen Seite gab es die Sapper App und auf der anderen Seite
                  die Svelte App. Mit den Neuerungen, soll ein einheitlicher Weg
                  empfohlen werden, sodass es zu einer deutlich besseren
                  Übersichtlichkeit beim Einstieg, Onboarding als auch bei der
                  Wartung und Instandhaltung von Code und dem ganzen Projekt
                  kommt. Zudem hat sich die Art und Weise Webentwicklung zu
                  betreiben drastisch geändert, womit es an der Zeit ist, einige
                  fundamentale Annahmen zu überdenken.
                </p>
              </div>
              <div slot="short">
                <ul>
                  <li>Leichterer Einstieg in Svelte</li>
                  <li>einheitlich eine Empfehlung wie Beginner einsteigen</li>
                  <li>Übersichtlichkeit und Wartbarkeit im Code verbessern</li>
                  <li>
                    Aufgrund der Art und Weise wie Webentwicklung sich geändert
                    hat, fundamentale Annahmen überdenken
                  </li>
                </ul>
              </div>
            </Content>
          </div>
        </Col>
      </Row>
    </Container>
  </FullpageSection>
  <FullpageSection center>
    <Container class="text-center">
      <Row>
        <Col>
          <div>
            <h1>Änderungen in <span class="svelte-color">SvelteKit</span></h1>
            <Content {long}>
              <div slot="long">
                <p>
                  Um bei den eben genannten fundamentalen Annahmen zu bleiben,
                  eine davon ist es, dass man einen "module bunderl" wie
                  beispielsweise webpack oder Rollup brauchst um app zu bauen.
                  Diese Werkzeuge tracken die Abhängigkeiten einer Applikation
                  und analysieren und transformieren Code (machen Svelte
                  Komponenten zu JS Modulen). Vor einigen Jahren brauchte man
                  die Bundler auf jeden Fall noch, da die Browser noch nicht
                  nativ im Stande waren, “import” Keywords zu unterstützen.
                  Aktuell sehen wir einen zunehmenden Anstieg von “unbundled
                  development workflow” welcher deutlich einfacher ist, als das
                  Bündeln von Apps. Ein Development Server kann ”on-demand”
                  Module bereitstellen (umgewandelt in JavaScript, wenn nötig).
                  Das bedeutet, dass der Start im Wesentlichen sofort erfolgt,
                  egal wie groß Ihre App wird. Einer der Vorreiter in diesem
                  Bereich ist Snowpack. Snowpack ist erstaunlich schnell und
                  bietet eine hervorragende Entwicklungserfahrung
                  (Hot-Modul-Reload, Fehlerüberlagerungen usw.), und für
                  SvelteKit wurde eng mit dem Snowpack-Team an Funktionen wie
                  SSR zusammengearbeitet. Besonders aufschlussreich ist das
                  Hot-Module-Reloading, wenn man es gewohnt ist, Sapper mit
                  Rollup zu verwenden (das aufgrund seiner Architektur, die die
                  effizienteste Ausgabe priorisiert, noch nie eine erstklassige
                  HMR-Unterstützung hatte). Um App in Produktion zu bringen
                  werden nach wie vor Bundler verwendet. SvelteKit verwendet
                  Rollup, um Apps so schnell und schlank wie möglich zu machen
                  (was beispielsweise das Extrahieren von Stilen in statische
                  .css-Dateien umfasst). Die andere grundlegende Annahme ist,
                  dass eine vom Server gerenderte App einen Server benötigt.
                  Sapper hat effektiv zwei Modi – Sapper Build, der eine
                  eigenständige App erstellt, die auf einem Node-Server
                  ausgeführt werden muss, und Sapper-Export, der die App als
                  Sammlung statischer Dateien ausgibt, die für das Hosten auf
                  Diensten wie GitHub Pages geeignet sind. Es ist weiterhin
                  möglich, sowohl Node-Apps als auch vollständig vorgerenderte
                  (auch exportierte) Sites zu erstellen SvelteKit umfasst das
                  serverlose Paradigma vollständig und wird mit Unterstützung
                  für alle großen serverlosen Anbieter gestartet, mit einer
                  'Adapter'-API für alle Plattformen, die offiziell nicht
                  bedient werden. Darüber hinaus wird man in der Lage sein,
                  partielles Pre-Rendering durchzuführen, was bedeutet, dass
                  statische Seiten zur Erstellungszeit generiert werden können,
                  während dynamische Seiten bei Bedarf gerendert werden.
                </p>
              </div>
              <div slot="short">
                <ul>
                  <li>Für Development kein Bundler mehr</li>
                  <li>Snowpack für deutliche Zeitersparnis bei Entwicklung</li>
                  <li>Hot-Module Reload und Fehlerüberlagerung</li>
                  <li>In Produktion Rollup als Bundler</li>
                  <li>vollständige Unterstützung serverloses Paradigma</li>
                  <li>Für großen Anbieter Plattformen -> Adapter API</li>
                </ul>
              </div>
            </Content>
          </div>
        </Col>
      </Row>
    </Container>
  </FullpageSection>
  <FullpageSection left>
    <Container class="text-left">
      <Row>
        <Col>
          <h1>Codebeispiele</h1>
          <p>
            <Tabs>
              <TabList>
                <Tab>Grundlegende Struktur</Tab>
                <Tab>Zähler</Tab>
                <Tab>Templates</Tab>
                <Tab>Two way binding</Tab>
                <Tab>Flüssige Zustandsübergänge</Tab>
                <Tab>Komponenten</Tab>
              </TabList>
              <TabPanel>
                <Example code={code.structureCode}>
                  <Structure />
                </Example>
              </TabPanel>
              <TabPanel>
                <Example code={code.counterCode}>
                  <Counter />
                </Example>
              </TabPanel>
              <TabPanel>
                <Example code={code.templatesCode}>
                  <Templates />
                </Example>
              </TabPanel>
              <TabPanel>
                <Example code={code.twowaybinding}>
                  <TwoWayBinding />
                </Example>
              </TabPanel>
              <TabPanel>
                <Example code={code.motion}>
                  <Motion />
                </Example>
              </TabPanel>
              <TabPanel>
                <Example code={code.components}>
                  <ComponentsOuter />
                </Example>
              </TabPanel>
            </Tabs>
          </p>
        </Col>
      </Row>
    </Container>
  </FullpageSection>
  <FullpageSection center>
    <Container class="text-center">
      <Row>
        <Col>
          <h1><span class="svelte-color">Quellen</span></h1>
          <ul>
            <li>
              <a href="https://kit.svelte.dev/docs">Svelte Doc</a>
            </li>
            <li>
              <a href="https://de.wikipedia.org/wiki/Svelte_(Framework)"
                >Wikipedia Svelte</a
              >
            </li>
            <li>
              <a href="https://sapper.svelte.dev/docs/">Sapper</a>
            </li>
            <li>
              <a href="https://sapper.svelte.dev/docs.json">Sapper</a>
            </li>
            <li>
              <a href="https://de.wikipedia.org/wiki/Sappeur"
                >Wikipedia Sappeur</a
              >
            </li>
            <li>
              <a href="https://svelte.dev/blog/whats-the-deal-with-sveltekit"
                >SvelteKit</a
              >
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  </FullpageSection>
</Fullpage>

<style>
  li{
    list-style-type: none;
  }

  .svelte-color {
    color: #ff3e00;
  }
  .sapper-color {
    color: #008d88;
  }
  .header-container {
    text-align: center;
  }
  .title {
    font-size: 90px;
    font-weight: 300;
  }
  .subheader {
    font-size: 32px;
  }
  .block-middle {
    padding: 170px;
  }
  h1 {
    font-size: 40px;
    font-weight: 500;
  }
  .title-section {
    font-size: 100px;
  }
  :global(.svelte-fp-indicator) {
    display: none !important;
  }
  :global(.svelte-tabs__selected){
    border-bottom: 2px solid #ff3e00 !important;
    color: #ff3e00 !important;
  }
  :global(pre){
    background: #f4f4f4 !important;
    border: 1px solid #ddd;
    border-left: 3px solid #ff3e00;
    color: #666;
    page-break-inside: avoid;
    font-family: monospace;
    font-size: 12px !important;
    line-height: 1.6;
    margin-bottom: 1.6em;
    max-width: 100%;
    overflow: auto;
    padding: 1em 1.5em;
    display: block;
    word-wrap: break-word;
    margin-right: 32px;
  }

  ul{
    padding-left: 0px;
  }

  #parallelogram {
    width: 250px;
    height: 100vh;
    position: absolute;
    top: 0px;
    left: calc(50% - 125px);
    z-index: -1;
    background: #ff3e00;
    /* Skew */
    -webkit-transform: skew(-20deg);
    -moz-transform: skew(-20deg);
    -o-transform: skew(-20deg);
    transform: skew(-20deg);
  }

  #enable_long{
    position: fixed;
    top: 25px;
    right: 25px;
    z-index: 1000;
  }

.number-title{
  font-size: 40px;
  border: 2px solid #555;
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: block;
  margin: 16px auto;
  padding: 2px;
  color: #555;
}

.switch {

  position: relative;
  display: inline-block;
  width: 40px;
  height: 28px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #ff3e00;
}

input:focus + .slider {
  box-shadow: 0 0 1px #ff3e00;
}

input:checked + .slider:before {
  -webkit-transform: translateX(12px);
  -ms-transform: translateX(12px);
  transform: translateX(12px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

</style>
