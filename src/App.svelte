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
          <h1 style="margin-bottom: 20px;" class="title-section svelte-color">Agenda</h1>
          <p>Was ist Svelte?</p>
          <p>Vorteile</p>
          <p>Nachteile</p>
          <p>Sapper</p>
          <p>Zukunftsausblick</p>
          <p>Codebeispiele</p>

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
                Der größte Vorteile von Svelte ist es, dass es ein Compiler ist und damit auf VirtualDOMs verzichten zu können.
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
              laufende Anwendung. 
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
              Code wie Hooks oder komplexes State Management. Der
              Boilerplate Code, der für die Komponenten benötigt wird, ist sehr minimal
              und kommt fast an Vanilla HTML/JS heran. 
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
              Zustandsänderungen in jeder Top-Level-Variable einer Komponente
              aktualisiert. 
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
              bereitstellt. Es gibt sogar eine
              NativeScript-Integration für Svelte, die von dieser Flexibilität
              Gebrauch macht, um andere Ziele wie dom und ssr zu erzeugen. Es
              gibt auch das Sapper-Framework, bald SvelteKit, 
              das ähnlich wie Next.js funktioniert, aber für Svelte
              optimiert ist. Sapper unterstützt SSR, Progressive Web Apps,
              Code-Splitting, und vieles mehr.
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
              Webkomponenten zu bestehenden Anwendungen macht. CSS Klassen sind
              standardmäßig auf Komponenten beschränkt, was die Benutzung von 
              Web-Komponenten erleichtert.
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
              machen, gute Benutzeroberflächen und interaktive
              Visualisierungen zu erstellen. Das Framework wurde
              ursprünglich für die Erstellung interaktiver Grafiken
              entwickelt. Dieser Ansatz bietet eine bessere
              Entwicklererfahrung als beispielsweise React und ist einfacher zu
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
              Zustandsverwaltung in einer Anwendung durchzuführen. Die Stores
              unterstützen manuelle und automatische Subscriptions und
              bidirektionale Bindungen, was es sehr flexibel macht. Die
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
              recht niedrig. Es gibt keine spezielle Syntax wie JSX die gelernt werden muss
              oder komplexe APIs wie bei Angular.
              Hauptsächlich wird in JS/TS, CSS und HTML geschrieben 
              und nur wenig mit spezieller Syntax für Direktiven und
              Template-Logik. Die Komponenten-API ist einfach und überschaubar.
              Die Dokumentation ist ebenfalls sehr gut und leicht
              nachvollziehbar. 
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
              Svelte ist sehr jung und das bedeutet, dass es noch nicht 
              so viel getestet wurde, wie beispielweise React oder Angular. 
              Das bedeutet, dass es
              wahrscheinlich nicht für sehr komplexe oder unternehmenskritische
              Anwendungen geeignet ist, von denen erwartet wird, dass sie
              skalieren können. Dies könnte kein langfristiges Problem sein, da das
              Framework in seiner Popularität stark ansteigt und die Einführung von
              Sapper bei den Skalierungsproblemen geholfen hat. 
            </p>
            </Content>
          </div>
        </Col>
        <Col>
          <div>
            <div class="number-title">2</div>
            <h1>
              Kleinere Community und <span class="svelte-color"
                >kleineres Ekosystem</span
              >
            </h1>
            <Content {long}>
              <p slot="long">
              Ein junges Framework zu sein bedeutet, dass es eine kleinere
              Community und Benutzerbasis sowie ein kleineres Ekosystem hat.
              Daher sind nicht so viele Tools oder Bibliotheken
              wie in React verfügbar. Ebenfalls ist die Hilfe auf Stack Overflow, wenn Sie bei
              einem komplexen Problem nicht weiterkommen geringer.
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
              Bei Full-Stack-Web-Applikations wird aktuell viel Zeit zum kompilieren benötigt.
              Svelte ist Compiler-lastig und je komplexer Ihre App
              wird, desto komplexer und zeitaufwändiger wird der Build. 
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
              Svelte ist konform mit den Webstandards, dabei wird nichts Neues wie
              beispielsweise JSX eingeführt. Aber es ändert einige der Standard-Semantiken, um auf
              eine andere Art und Weise zu arbeiten und das könnte für neue
              Benutzer verwirrend sein. Zum Beispiel verwendet es das
              Schlüsselwort export anders und die Syntax ist in manchen Fällen anders. 
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
                Sapper ist ein auf Svelte aufbauendes Metaframework, dass die Entwicklung von hochperformanten Svelte-Applikationen einfach gestaltet.
                Als solches bietet es Server-side rendering, Codesplitting, und einen integrierten Routing-Ansatz ähnlich wie bei Next.js.
                Hier gilt: eine Komponente pro Seite.
              </p>
              <p>
                Durch Prerendern der HTML-Struktur kann Sapper die initiale Loadzeit deutlich veringern,
                da der Client hier anfangs kein Javascript ausführen oder laden muss.
              </p>
            </div>
            <div slot="short">
              <ul>
                <li>
                  Auf Svelte aufbauendes Metaframework
                </li>
                <li>Einfache Gestaltung von Webapplications</li>
                <li>Server Side Rendering (SSR)</li>
                <li>Code Splitting</li>
                <li>Integrierter Rounting Ansatz wie bei Next.js</li>
                <li>Ähnlich wie bei Next.js Filesystem-based routing</li>
                <li>
                  Prerender von HTML Templates
                </li>
                <li>
                  Optimierung von Search Engine Optimization (SEO)
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
                 Sapper ist kurz für "Svelte App maker", ist aber auch eine Anspielung an den Militärbegriff Sappeur, welcher einen Straßen oder Brückenbauer beschreibt.
                </p>
              </div>
              <div slot="short">
                <ul>
                  <li>Sapper ist kurz für "<span class="svelte-color">S</span>velte <span class="svelte-color">app</span> mak<span class="svelte-color">er</span>"</li>
                  <li>Anspielung auf Militärbegriff: bedeutet dort Brückenbauer oder Straßenbauer</li>
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
                  Aufgrund der Verwendung von Svelte als Basisframework ist Sapper deutlich performanter
                  als das auf React basierende Next.JS.
                  Da Vvelte ein Compiler ist kann Sapper hier in seiner Entwickler-API deutlich ergonomischer sein.
                  So können beispielsweise Links über gewohnte a> elemente umgesetzt werden, statt
                  framework-spezifische Komponenten zu benötigen.
                </p>
              </div>
              <div slot="short">
                <ul>
                  <li> Performanter </li>
                  <li> Bessere API </li>
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
                  Vor Allem für Einsteiger ist die Entscheidung zwischen zwei verschiedenen empfohlenen Wegen eine Svelte-app
                  zu starten sehr verwirrend.
                  Auf der einen Seite gibt es die Sapper-App, und auf der anderen den direkten Svelte Ansatz.
                  Mit SvelteKit soll ein einheitlicher Weg empfohlen werden, sodass es zu einem
                  einfacheren Einstieg und besserer Wartbarkeit in Svelteprojekte kommt.
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
                  Eine der größten Änderungen im üblichen Webworkflow ist, dass man bis vor kurzem 
                  typischerweise auf einen Bundler zur Entwicklung gesetzt hatte.
                  Diese transformieren und verpacken den Code sowohl für die Entwicklung als auch als Releaseartefakte.

                  Inzwischen ist die Entwicklung im unbundled development workflow immer häufiger.
                  Ein Development-Server kann on-demand Module bereitstellen. Dies bedeutet dass
                  module sofort geladen werden können, ohne dass die größe des Projekts die Geschwindigkeit beeinflusst.

                  Vorreiter in diesem Gebiet ist "Snowpack", welcher SSR sowie ergonomisches Hot-module-reloading bietet.

                  Für Release-builds verwendet SvelteKit jedoch weiterhin einen Bundler. Hier wird auf Rollup gesetzt, um kleinst mögliche Buildartefakte bieten zu können.


                  Auch bietet SvelteKit die Möglichkeit, Server-side Rendering ohne tatsächlichen Server umzusetzen.
                  Hierbei kann der Inhalt der serverseitig gerendert werden soll bereits im Build-schritt
                  mit gebaut werden, sodass dies dann für frontend-only Hosting-Lösungen wie Github Pages verfügbar ist.
                </p>
              </div>
              <div slot="short">
                <ul>
                  <li>Für Development Bundler nicht mehr notwendig</li>
                  <li>Developmentserver kann on-demand Module bereitstellen</li>
                  <li>Hot-Module Reload</li>
                  <li>Rollup als Bundler</li>
                  <li>Serverloses Paradigma</li>
                  <li>Adapter API</li>
                  <li>Partielles Pre-Rendering</li>
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
          <h1 style="margin-top: 20px;">Codebeispiele</h1>
          <p>
            <Tabs>
              <TabList>
                <Tab>Grundlegende Struktur</Tab>
                <Tab>Zähler</Tab>
                <Tab>Templates</Tab>
                <Tab>Two way binding</Tab>
                <Tab>Komponenten</Tab>
                <Tab>Flüssige Zustandsübergänge</Tab>
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
                <Example code={code.components}>
                  <ComponentsOuter />
                </Example>
              </TabPanel>
              <TabPanel>
                <Example code={code.motion}>
                  <Motion />
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
          <h4 >Präsentation verfügbar als <span class="svelte-color">Svelte</span> Seite unter:</h4>
          <h4 >https://nilsmangold.github.io/wad-presentation/index.html</h4>
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
    font-size: 11px !important;
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

