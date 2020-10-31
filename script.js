    // Three JS

    window.addEventListener('load', init, false);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        const newColorScheme = e.matches ? "dark" : "light";
        deleteWorld();
    });

    function init() {
        createWorld();
        createPrimitive();
        animation();
    }

    var Theme = {
        _darkred: 0x000000,
        _light: 0xffffff
    }

    var scene, camera, renderer, container;
    var start = Date.now();
    var _width, _height;

    function createWorld() {
        _width = window.innerWidth;
        _height = window.innerHeight;
        scene = new THREE.Scene();
        if (window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches) {
            scene.background = new THREE.Color(Theme._darkred);
        } else {
            scene.background = new THREE.Color(Theme._light);

        }
        camera = new THREE.PerspectiveCamera(55, _width / _height, 1, 1000);
        camera.position.z = 12;
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false 
        });
        renderer.setSize(_width, _height);
        container = document.getElementById("container");
     container.appendChild(renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);
    }

   function deleteWorld() {
container.removeChild(renderer.domElement);
    }

    function onWindowResize() {
        _width = window.innerWidth;
        _height = window.innerHeight;
        renderer.setSize(_width, _height);
        camera.aspect = _width / _height;
        camera.updateProjectionMatrix();
        console.log('- resize -');
    }

    var mat;
    var primitiveElement = function () {
        this.mesh = new THREE.Object3D();
        mat = new THREE.ShaderMaterial({
            wireframe: false,
            uniforms: {
                time: {
                    type: "f",
                    value: 0.0
                },
                pointscale: {
                    type: "f",
                    value: 0.0
                },
                decay: {
                    type: "f",
                    value: 0.0
                },
                complex: {
                    type: "f",
                    value: 0.0
                },
                waves: {
                    type: "f",
                    value: 0.0
                },
                eqcolor: {
                    type: "f",
                    value: 0.0
                },
                fragment: {
                    type: "i",
                    value: true
                },
                redhell: {
                    type: "i",
                    value: true
                }
            },
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent
        });
        var geo = new THREE.IcosahedronBufferGeometry(2, 7);
        var mesh = new THREE.Points(geo, mat);

        this.mesh.add(mesh);
    }

    var _primitive;

    function createPrimitive() {
        _primitive = new primitiveElement();
        scene.add(_primitive.mesh);
    }

    //--------------------------------------------------------------------

    var options = {
        perlin: {
            vel: 0.012,
            speed: 0.000250,
            perlins: 2.5,
            decay: 0.05,
            complex: 0.20,
            waves: 10.0,
            eqcolor: 8.0,
            fragment: true,
            redhell: true
        },
        spin: {
            sinVel: 0.2,
            ampVel: 20.0,
        }
    }

    function animation() {
        requestAnimationFrame(animation);
        var performance = Date.now() * 0.003;

        _primitive.mesh.rotation.y += options.perlin.vel;
        _primitive.mesh.rotation.x = (Math.sin(performance * options.spin.sinVel) * options.spin.ampVel) * Math.PI / 180;
        //---
        mat.uniforms['time'].value = options.perlin.speed * (Date.now() - start);
        mat.uniforms['pointscale'].value = options.perlin.perlins;
        mat.uniforms['decay'].value = options.perlin.decay;
        mat.uniforms['complex'].value = options.perlin.complex;
        mat.uniforms['waves'].value = options.perlin.waves;
        mat.uniforms['eqcolor'].value = options.perlin.eqcolor;
        mat.uniforms['fragment'].value = options.perlin.fragment;
        mat.uniforms['redhell'].value = options.perlin.redhell;
        //---
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }
