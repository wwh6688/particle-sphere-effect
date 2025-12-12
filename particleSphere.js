// 粒子球效果实现
class ParticleSphere {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particleSystem = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }
    
    init() {
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        
        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 300;
        
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('particleCanvas'),
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // 创建粒子系统
        this.createParticleSystem();
    }
    
    createParticleSystem() {
        const particleCount = 5000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        // 生成粒子位置和颜色
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // 使用球坐标系生成点
            const radius = 100 + Math.random() * 50;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            
            // 随机颜色
            colors[i3] = 0.5 + Math.random() * 0.5; // R
            colors[i3 + 1] = 0.3 + Math.random() * 0.7; // G
            colors[i3 + 2] = 0.7 + Math.random() * 0.3; // B
            
            // 随机大小
            sizes[i] = 1 + Math.random() * 3;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // 材质
        const material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        // 创建粒子系统
        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.update();
        this.render();
    }
    
    update() {
        // 旋转粒子球
        this.particleSystem.rotation.x += 0.003;
        this.particleSystem.rotation.y += 0.005;
        
        // 鼠标交互影响粒子位置
        const time = Date.now() * 0.00005;
        const positions = this.particleSystem.geometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            // 添加一些波动效果
            positions[i] += Math.sin(time * 2 + i) * 0.1;
            positions[i + 1] += Math.sin(time * 3 + i) * 0.1;
            positions[i + 2] += Math.sin(time * 4 + i) * 0.1;
        }
        
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }
    
    render() {
        this.renderer.render(this.scene, this.camera);
    }
    
    setupEventListeners() {
        // 鼠标移动事件
        document.addEventListener('mousemove', (event) => {
            this.mouseX = event.clientX - this.windowHalfX;
            this.mouseY = event.clientY - this.windowHalfY;
        });
        
        // 窗口大小变化事件
        window.addEventListener('resize', () => {
            this.windowHalfX = window.innerWidth / 2;
            this.windowHalfY = window.innerHeight / 2;
            
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => {
    new ParticleSphere();
});