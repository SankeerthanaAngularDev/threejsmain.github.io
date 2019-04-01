        var container, scene, renderer, camera, light, gridHelper, controls, raycaster, mouse, INTERSECTED, rayTarget, id, object, eventsControls;
        var objects = [];
        init();
        render();
        $("#addTexture").click(function () {
            loadTexture();
        });
        $("#addPlane").click(function () {
            loadPlane();
        });



        function init() {
            container = $('#container').attr('id')
            scene = new THREE.Scene()
            scene.background = new THREE.Color(0xffffff);

            renderer = new THREE.WebGLRenderer({
                antialias: true
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            $('#container').append(renderer.domElement);

            camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 3000);
            camera.position.set(0, 500, 1400);
            camera.lookAt(0, 200, 0);

//            light = new THREE.DirectionalLight(0xffffff, 2);
//            light.position.set(1, 1, 1);
//            scene.add(light);


            gridHelper = new THREE.GridHelper(1000, 30, 0x444444, 0xC0C0C0);
            scene.add(gridHelper);

            var array = gridHelper.geometry.attributes.color.array;

            for (var i = 0; i < array.length; i += 60) {

                for (var j = 0; j < 12; j++) {
                    array[i + j] = 0.5;
                }
            }

            var geometry = new THREE.PlaneGeometry(200, 200);
            var material = new THREE.MeshBasicMaterial({
                color: "blue",
                side: THREE.DoubleSide
            });
            var plane = new THREE.Mesh(geometry, material);
            plane.position.set(-300, 100, 100);
            scene.add(plane);
            objects.push(plane);

            plane.name = makeid(5);

            var geometry1 = new THREE.PlaneGeometry(200, 200);
            var material1 = new THREE.MeshBasicMaterial({
                color: "green",
                side: THREE.DoubleSide
            });
            var plane1 = new THREE.Mesh(geometry1, material1);
            plane1.position.set(50, 100, 100);
            scene.add(plane1);
            objects.push(plane1);

            plane1.name = makeid(5);

            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.update();
            controls.addEventListener('change', render);

            transformControls = new THREE.TransformControls(camera, renderer.domElement);
            transformControls.addEventListener('change', render);

            transformControls.addEventListener('dragging-changed', function (event) {
                controls.enabled = !event.value;

            });

            transformControls.attach(plane1);
            transformControls.attach(plane);
            id = transformControls.children[0].object.name;

            scene.add(transformControls);
            window.addEventListener('resize', onWindowResize, false);

            $("#container").mousedown(function (evenet) {
                onDocumentMouseDown(event);
            });

            $(document).on('keydown', function (event) {

                switch (event.which) {

                    case 84: // T
                        transformControls.setMode("translate");
                        break;

                    case 82: // R
                        transformControls.setMode("rotate");
                        break;

                    case 83: // S
                        transformControls.setMode("scale");
                        break;


                }
            });
        }

        function onDocumentMouseDown(event) {
            controls.enabled = false;
            controls.removeEventListener('change', render);
            //
            event.preventDefault();
            id = transformControls.children[0].object.name;
            raycaster = new THREE.Raycaster();
            mouse = new THREE.Vector3();
            mouse.x = ((event.clientX - $('#container').offset().left) / $('#container').width()) * 2 - 1;
            mouse.y = -(((event.clientY - $('#container').offset().top) / $('#container').innerHeight()) * 2 - 1);
            camera.lookAt(scene.position);

            camera.updateMatrixWorld();




            raycaster.setFromCamera(mouse, camera, objects);
            var intersects = raycaster.intersectObjects(objects);
            console.log(intersects);

            if (intersects.length > 0) {



                if (INTERSECTED != intersects[0].object) {

                    if (INTERSECTED); {
                        INTERSECTED = intersects[0].object;
                    }

                    transformControls.attach(INTERSECTED);

                    scene.add(transformControls);
                    id = transformControls.children[0].object.name;
                    animate();

                } else {

                    if (INTERSECTED); {
                        INTERSECTED = null;
                    }
                }
            }
        }


        function loadTexture() {
            var object = scene.getObjectByName(id);
            new THREE.TextureLoader().load("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUvLo16LFC0kr7OnyxtnDvVtFVJavpnG1AmW4cRJaLQKQAiw4g", function onLoad(texture) {
                var material1 = new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.DoubleSide
                });
                object.material = material1;
                document.addEventListener('mousedown', onDocumentMouseDown, false);
            });
        }

        function loadPlane() {
            var newGeometry = new THREE.PlaneGeometry(200, 200);
            var newMaterial = new THREE.MeshBasicMaterial({
                color: "green",
                side: THREE.DoubleSide
            });
            var newPlane = new THREE.Mesh(newGeometry, newMaterial);
            newPlane.position.set(100, 100, 100);
            newPlane.name = makeid(5);
            scene.add(newPlane);
            transformControls.attach(newPlane);
            objects.push(newPlane);
        }

        function onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);

            render();

        }

        function animate() {
            requestAnimationFrame(animate);
            // transformControls.update();
            controls.update();
            transformControls.updateMatrixWorld();
            transformControls.addEventListener('change', render);
            render();
        }

        function makeid(id) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            for (var i = 0; i < id; i++)
                text += possible.charAt(Math.floor(Math.random() * id));

            return text;
        }




        function render() {

            renderer.render(scene, camera);
            // transformControls.updateMatrixWorld();

        }
