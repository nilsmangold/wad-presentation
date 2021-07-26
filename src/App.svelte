<script>
  import { Fullpage, FullpageSection, FullpageSlide } from "svelte-fullpage";
  import { Container, Row, Col } from "sveltestrap";
  import { Tabs, Tab, TabList, TabPanel } from "svelte-tabs";
  import Content from "./Content.svelte";

  import * as code from "./code.js";
  import Counter from "./examples/Counter.svelte";
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
              Walter (Mtrk.)
            </p>

            <label for="enable_long">Fließtext</label>
            <input id="enable_long" type=checkbox bind:checked={long}/>
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
                  Svelte ist ein Komponenten-Framework - wie React oder Vue -
                  aber mit einem wichtigen Unterschied. Traditionelle Frameworks
                  erlauben es Ihnen, deklarativen zustandsgesteuerten Code zu
                  schreiben, aber es gibt einen Nachteil: Der Browser muss
                  zusätzliche Arbeit leisten, um diese deklarativen Strukturen
                  in DOM-Operationen umzuwandeln, wobei Techniken wie diese Ihr
                  Frame-Budget auffressen und den Garbage Collector belasten.
                </p>
                <p>
                  Stattdessen läuft Svelte zur Build-Zeit und konvertiert Ihre
                  Komponenten in hocheffizienten imperativen Code, der das DOM
                  chirurgisch aktualisiert. Das Ergebnis ist, dass Sie in der
                  Lage sind, anspruchsvolle Anwendungen mit hervorragenden
                  Leistungsmerkmalen zu schreiben.
                </p>
                <p>
                  In der ersten Version von Svelte ging es darum, dass ein
                  zweckmäßiger Compiler felsenfesten Code erzeugen kann, der ein
                  großartiges Benutzererlebnis bietet. Die zweite war ein
                  kleines Upgrade, das die Dinge ein wenig aufgeräumt hat.
                </p>
                <p>
                  Version 3 ist eine signifikante Überarbeitung. In den letzten
                  fünf oder sechs Monaten haben wir uns darauf konzentriert, ein
                  hervorragendes Entwicklererlebnis zu bieten. Es ist jetzt
                  möglich, Komponenten zu schreiben, mit denen man anderswo
                  nicht zurechtkommt. Probieren Sie das brandneue aus und sehen
                  Sie, was wir meinen - wenn Sie mit anderen Frameworks vertraut
                  sind, werden Sie angenehm überrascht sein.
                </p>
                <p>
                  Um das möglich zu machen, mussten wir zunächst das Konzept
                  überdenken, das den modernen UI-Frameworks zugrunde liegt:
                  Reaktivität.
                </p>
              </div>
              <div slot="short">
                <ul>
                  <li>Komponenten-Framework</li>
                  <li>
                    Compiler für bessere Performance und kleinere
                    Build-Artefakte
                  </li>
                  <li>Reaktives UI-Konzept</li>
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
            <h1>
              Compiler vs. <span class="svelte-color">Virtuelles DOM</span>
            </h1>

            <p>
              Ein Compiler zu sein und das VirtualDOM loszuwerden ist der
              wichtigste Vorteil von Svelte, der viele der anderen Vorteile
              ermöglicht, die wir weiter unten sehen werden. Das Konzept erfreut
              sich so großer Beliebtheit, dass Angular und Ember in ihren
              jüngsten Versionen auf Compiler umgestellt haben.
            </p>
          </div>
        </Col>
        <Col>
          <div>
            <h1>
              Leichtgewichtig & <span class="svelte-color">Performant</span>
            </h1>

            <p>
              Svelte erzeugt hochoptimiertes Vanilla JS mit einem sehr geringen
              Overhead zur Laufzeit. Das bedeutet kleine Bundle-Größen, einen
              geringen Speicherbedarf und eine schnell ladende und schnell
              laufende Anwendung. Schauen Sie sich die Performance-Benchmarks
              hier an, um den Unterschied zu sehen. All dies ist "out of the
              box", ohne dass Sie irgendwelche Einstellungen vornehmen müssen,
              und es gibt viele Möglichkeiten, die Leistung noch weiter zu
              verbessern.
            </p>
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
            <h1>
              Weniger <span class="svelte-color">Boilerplate</span>
            </h1>

            <p>
              Mit Svelte gibt es keine Notwendigkeit für das Hinzufügen von Glue
              Code wie Hooks oder komplexes State Management und so weiter. Die
              Boilerplate, die für Komponenten benötigt wird, ist sehr minimal
              und kommt fast an Vanilla HTML/JS heran. Svelte unterstützt auch
              optionale Zwei-Wege-Bindungen, die es einfacher machen, Formulare
              zu erstellen.
            </p>
          </div>
        </Col>
        <Col>
          <div>
            <h1>
              Wirklich <span class="svelte-color">reaktiv</span>
            </h1>
            <p>
              Svelte ist standardmäßig reaktiv. Das DOM wird automatisch bei
              Zustandsänderungen in jeder Top-Level-Variablen einer Komponente
              aktualisiert. Sie müssen dafür nicht einmal speziellen Code
              hinzufügen. Nur direkte Top-Level-Zuweisungen funktionieren auf
              diese Weise und Referenzmutationen wie array.push funktionieren
              nicht. Das bedeutet, dass Mutationen meiner Meinung nach
              expliziter und einfacher zu verstehen sind.
            </p>
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
            <h1>
              Mehrere <span class="svelte-color">Ausgabeziele</span>
            </h1>
            <p>
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
          </div>
        </Col>
        <Col>
          <div>
            <h1>
              Komponenten-<span class="svelte-color">Muster</span>
            </h1>
            <p>
              Svelte folgt einem Component-First-Pattern, was es ideal für die
              Erstellung neuer Webanwendungen oder für das Hinzufügen von
              Webkomponenten zu bestehenden Anwendungen macht. Stile sind
              standardmäßig auf Komponenten skaliert, was Svelte ideal für
              Web-Komponenten macht.
            </p>
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
            <h1>
              Eingebaute Animationen und <span class="svelte-color"
                >Effekte</span
              >
            </h1>
            <p>
              Svelte bietet eingebaute Animationen und Effekte, die es einfacher
              machen, glatte Benutzeroberflächen und interaktive
              Visualisierungen zu erstellen. Nun, das Framework wurde
              ursprünglich für die Erstellung interaktiver Grafiken für The
              Guardian entwickelt. Dieser Ansatz bietet eine viel schönere
              Entwicklererfahrung als etwas wie React und ist viel einfacher zu
              verwenden.
            </p>
          </div>
        </Col>
        <Col>
          <div>
            <h1>
              Eingebauter reaktiver <span class="svelte-color">Speicher</span>
            </h1>
            <p>
              Svelte bietet sowohl veränderliche als auch unveränderliche
              reaktive Speicher, die es einfacher machen, komplexere
              Zustandsverwaltung in Ihrer Anwendung durchzuführen. Die Stores
              unterstützen manuelle und automatische Subskriptionen und
              bidirektionale Bindungen, was sie sehr flexibel macht. Die
              Implementierung ermöglicht auch den Wechsel zu einer anderen
              Zustandsverwaltungslösung wie z. B. RxJS.
            </p>
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
            <h1>
              Niedrige <span class="svelte-color">Lernkurve</span>
            </h1>
            <p>
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
            <h1>
              Junges <span class="svelte-color">Framework</span>
            </h1>
            <p>
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
          </div>
        </Col>
        <Col>
          <div>
            <h1>
              Kleinere Community und <span class="svelte-color"
                >kleineres Ökosystem</span
              >
            </h1>
            <p>
              Ein junges Framework zu sein bedeutet, dass es eine kleinere
              Community und Benutzerbasis sowie ein kleineres Ökosystem hat.
              Daher finden Sie vielleicht nicht so viele Tools oder Bibliotheken
              wie in React oder so viel Hilfe auf Stack Overflow, wenn Sie bei
              einem komplexen Problem nicht weiterkommen.
            </p>
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
            <h1>
              Compilation <span class="svelte-color">heavy</span>
            </h1>
            <p>
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
          </div>
        </Col>
        <Col>
          <div>
            <h1>
              Mac<span class="svelte-color">ken</span>
            </h1>
            <p>
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
          </div>
        </Col>
      </Row>
    </Container>
  </FullpageSection>
  <FullpageSection center>
    <Container class="text-center">
      <Row>
        <Col>
          <h1>Sapper</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <div>
            <h1>Warum das Bestehende ändern?</h1>
            <p>
              Vor allem für Einsteiger ist der Unterschied von zwei empfohlenen
              Wegen eine App zu starten sehr verwirrend. Auf der einen Seite gab
              es die Sapper App und auf der anderen Seite die Svelte App. Mit
              den Neuerungen, soll ein einheitlicher Weg empfohlen werden,
              sodass es zu einer deutlich besseren Übersichtlichkeit beim
              Einstieg, Onboarding als auch bei der Wartung und Instandhaltung
              von Code und dem ganzen Projekt kommt. Zudem hat sich die Art und
              Weise Webentwicklung zu betreiben drastisch geändert, womit es an
              der Zeit ist, einige fundamentale Annahmen zu überdenken.
            </p>
          </div>
        </Col>
        <Col
          ><div>
            <h1>Was hat/wird sich verändern?</h1>
            <p>
              Um bei den eben genannten fundamentalen Annahmen zu bleiben, eine
              davon ist es, dass man einen module bunderl wie beispielsweise
              webpack oder Rollup brauchst um app zu bauen. Diese Werkzeuge
              tracken die Abhängigkeiten einer Applikation und analysieren und
              transformieren Code (machen Svelte Komponenten zu JS Modulen). Vor
              einigen Jahren brauchte man die Bundler auf jeden Fall noch, da
              die Browser noch nicht nativ im Stande waren, “import” Keywords zu
              unterstützen. Aktuell sehen wir einen zunehmenden Anstieg von
              “unbundled development workflow” welcher deutlich einfacher ist,
              als das Bündeln von Apps. Ein Development Server kann ”on-demand”
              Module bereitstellen (umgewandelt in JavaScript, wenn nötig). Das
              bedeutet, dass der Start im Wesentlichen sofort erfolgt, egal wie
              groß Ihre App wird. Einer der Vorreiter in diesem Bereich ist
              Snowpack. Snowpack ist erstaunlich schnell und bietet eine
              hervorragende Entwicklungserfahrung (Hot-Modul-Reload,
              Fehlerüberlagerungen usw.), und für SvelteKit wurde eng mit dem
              Snowpack-Team an Funktionen wie SSR zusammengearbeitet. Besonders
              aufschlussreich ist das Hot-Module-Reloading, wenn man es gewohnt
              ist, Sapper mit Rollup zu verwenden (das aufgrund seiner
              Architektur, die die effizienteste Ausgabe priorisiert, noch nie
              eine erstklassige HMR-Unterstützung hatte). Um App in Produktion
              zu bringen werden nach wie vor Bundler verwendet. SvelteKit
              verwendet Rollup, um Apps so schnell und schlank wie möglich zu
              machen (was beispielsweise das Extrahieren von Stilen in statische
              .css-Dateien umfasst). Die andere grundlegende Annahme ist, dass
              eine vom Server gerenderte App einen Server benötigt. Sapper hat
              effektiv zwei Modi – Sapper Build, der eine eigenständige App
              erstellt, die auf einem Node-Server ausgeführt werden muss, und
              Sapper-Export, der die App als Sammlung statischer Dateien
              ausgibt, die für das Hosten auf Diensten wie GitHub Pages geeignet
              sind. Es ist weiterhin möglich, sowohl Node-Apps als auch
              vollständig vorgerenderte (auch exportierte) Sites zu erstellen
              SvelteKit umfasst das serverlose Paradigma vollständig und wird
              mit Unterstützung für alle großen serverlosen Anbieter gestartet,
              mit einer 'Adapter'-API für alle Plattformen, die offiziell nicht
              bedient werden. Darüber hinaus wird man in der Lage sein,
              partielles Pre-Rendering durchzuführen, was bedeutet, dass
              statische Seiten zur Erstellungszeit generiert werden können,
              während dynamische Seiten bei Bedarf gerendert werden.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  </FullpageSection>
  <FullpageSection left>
    <Container class="text-left">
      <Row>
        <Col>
          <h1>Code</h1>
          <p>
            <Tabs>
              <TabList>
                <Tab>Counter</Tab>
                <Tab>Templates</Tab>
                <Tab>Two way binding</Tab>
                <Tab>Motion</Tab>
                <Tab>Componenten</Tab>
              </TabList>
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
</Fullpage>

<style>
  .svelte-color {
    color: #ff3e00;
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
</style>