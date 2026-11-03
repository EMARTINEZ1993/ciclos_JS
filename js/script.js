
      (function () {
        var pasos = Array.prototype.slice.call(
          document.querySelectorAll(".paso"),
        );
        var total = pasos.length,
          i = 0;
        var cont = document.getElementById("contador"),
          act = document.getElementById("actual");
        var barra = document.getElementById("progreso");
        var ant = document.getElementById("anterior"),
          sig = document.getElementById("siguiente");
        var indice = document.querySelectorAll("[data-ir]");

        function mostrar(n, desplazar) {
          i = Math.max(0, Math.min(total - 1, n));
          pasos.forEach(function (p, k) {
            p.hidden = k !== i;
          });
          cont.textContent = "Paso " + (i + 1) + " de " + total;
          act.textContent = pasos[i].getAttribute("data-titulo");
          barra.style.width = ((i + 1) / total) * 100 + "%";
          ant.disabled = i === 0;
          var ultimo = i === total - 1;
          sig.textContent = ultimo ? "✓ Guía completada" : "Siguiente →";
          sig.disabled = ultimo;
          indice.forEach(function (b) {
            if (+b.getAttribute("data-ir") === i)
              b.setAttribute("aria-current", "step");
            else b.removeAttribute("aria-current");
          });
          try {
            history.replaceState(null, "", "#paso-" + (i + 1));
          } catch (e) {}
          if (desplazar)
            document.querySelector("main").scrollIntoView({ block: "start" });
        }
        ant.addEventListener("click", function () {
          mostrar(i - 1, true);
        });
        sig.addEventListener("click", function () {
          mostrar(i + 1, true);
        });
        indice.forEach(function (b) {
          b.addEventListener("click", function () {
            mostrar(+b.getAttribute("data-ir"), true);
            var d = b.closest("details");
            if (d) d.open = false;
          });
        });
        var m = /^#paso-(\d+)$/.exec(location.hash || "");
        mostrar(m ? +m[1] - 1 : 0, false);

        // Pestañas (paso 7)
        document.querySelectorAll(".pestanas").forEach(function (grupo) {
          var bts = grupo.querySelectorAll("button");
          var cont = grupo.parentNode;
          function activar(id) {
            bts.forEach(function (b) {
              b.setAttribute(
                "aria-selected",
                b.getAttribute("data-tab") === id ? "true" : "false",
              );
            });
            cont.querySelectorAll(".panel").forEach(function (p) {
              p.hidden = p.getAttribute("data-panel") !== id;
            });
          }
          bts.forEach(function (b) {
            b.addEventListener("click", function () {
              activar(b.getAttribute("data-tab"));
            });
          });
          activar(bts[0].getAttribute("data-tab"));
        });

        // Copiar código
        document.querySelectorAll(".copiar").forEach(function (b) {
          b.addEventListener("click", function () {
            var code = b.closest(".codigo").querySelector("code");
            var texto = code.textContent;
            function hecho(t) {
              b.textContent = t;
              setTimeout(function () {
                b.textContent = "Copiar";
              }, 1600);
            }
            function seleccionar() {
              var r = document.createRange();
              r.selectNodeContents(code);
              var s = window.getSelection();
              s.removeAllRanges();
              s.addRange(r);
              hecho("Seleccionado: Ctrl+C");
            }
            try {
              navigator.clipboard.writeText(texto).then(function () {
                hecho("Copiado");
              }, seleccionar);
            } catch (e) {
              seleccionar();
            }
          });
        });

        // Código JavaScript sin opción de copiar
        document.querySelectorAll(".protegido").forEach(function (f) {
          ["copy", "cut", "contextmenu", "dragstart"].forEach(function (ev) {
            f.addEventListener(ev, function (e) {
              e.preventDefault();
            });
          });
        });

        // Lista de verificación (se recuerda en este navegador)
        document.querySelectorAll(".checklist input").forEach(function (c) {
          try {
            c.checked = localStorage.getItem("ciclosjs-" + c.id) === "1";
          } catch (e) {}
          c.addEventListener("change", function () {
            try {
              localStorage.setItem("ciclosjs-" + c.id, c.checked ? "1" : "0");
            } catch (e) {}
          });
        });
      })();
   