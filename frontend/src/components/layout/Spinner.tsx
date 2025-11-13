interface SpinnerProps {
    size?: number;
    className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 50, className = '' }) => {
    return (
        <div className={`inline-block ${className}`} style={{ width: size, height: size }}>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 100 100" 
                preserveAspectRatio="xMidYMid" 
                width="100%" 
                height="100%"
                style={{ shapeRendering: 'auto', display: 'block' }}
            >
                <g>
                    <circle fill="#012646" r="10" cy="50" cx="84">
                        <animate 
                            begin="0s" 
                            keySplines="0 0.5 0.5 1" 
                            values="10;0" 
                            keyTimes="0;1" 
                            calcMode="spline" 
                            dur="0.641025641025641s" 
                            repeatCount="indefinite" 
                            attributeName="r"
                        />
                        <animate 
                            begin="0s" 
                            values="#012646;#eeeeee;#012646;#eeeeee;#012646" 
                            keyTimes="0;0.25;0.5;0.75;1" 
                            calcMode="discrete" 
                            dur="2.564102564102564s" 
                            repeatCount="indefinite" 
                            attributeName="fill"
                        />
                    </circle>
                    <circle fill="#012646" r="10" cy="50" cx="16">
                        <animate 
                            begin="0s" 
                            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" 
                            values="0;0;10;10;10" 
                            keyTimes="0;0.25;0.5;0.75;1" 
                            calcMode="spline" 
                            dur="2.564102564102564s" 
                            repeatCount="indefinite" 
                            attributeName="r"
                        />
                        <animate 
                            begin="0s" 
                            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" 
                            values="16;16;16;50;84" 
                            keyTimes="0;0.25;0.5;0.75;1" 
                            calcMode="spline" 
                            dur="2.564102564102564s" 
                            repeatCount="indefinite" 
                            attributeName="cx"
                        />
                    </circle>
                    <circle fill="#eeeeee" r="10" cy="50" cx="50">
                        <animate 
                            begin="-0.641025641025641s" 
                            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" 
                            values="0;0;10;10;10" 
                            keyTimes="0;0.25;0.5;0.75;1" 
                            calcMode="spline" 
                            dur="2.564102564102564s" 
                            repeatCount="indefinite" 
                            attributeName="r"
                        />
                        <animate 
                            begin="-0.641025641025641s" 
                            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" 
                            values="16;16;16;50;84" 
                            keyTimes="0;0.25;0.5;0.75;1" 
                            calcMode="spline" 
                            dur="2.564102564102564s" 
                            repeatCount="indefinite" 
                            attributeName="cx"
                        />
                    </circle>
                    <circle fill="#012646" r="10" cy="50" cx="84">
                        <animate 
                            begin="-1.282051282051282s" 
                            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" 
                            values="0;0;10;10;10" 
                            keyTimes="0;0.25;0.5;0.75;1" 
                            calcMode="spline" 
                            dur="2.564102564102564s" 
                            repeatCount="indefinite" 
                            attributeName="r"
                        />
                        <animate 
                            begin="-1.282051282051282s" 
                            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" 
                            values="16;16;16;50;84" 
                            keyTimes="0;0.25;0.5;0.75;1" 
                            calcMode="spline" 
                            dur="2.564102564102564s" 
                            repeatCount="indefinite" 
                            attributeName="cx"
                        />
                    </circle>
                    <circle fill="#eeeeee" r="10" cy="50" cx="16">
                        <animate 
                            begin="-1.923076923076923s" 
                            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" 
                            values="0;0;10;10;10" 
                            keyTimes="0;0.25;0.5;0.75;1" 
                            calcMode="spline" 
                            dur="2.564102564102564s" 
                            repeatCount="indefinite" 
                            attributeName="r"
                        />
                        <animate 
                            begin="-1.923076923076923s" 
                            keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" 
                            values="16;16;16;50;84" 
                            keyTimes="0;0.25;0.5;0.75;1" 
                            calcMode="spline" 
                            dur="2.564102564102564s" 
                            repeatCount="indefinite" 
                            attributeName="cx"
                        />
                    </circle>
                </g>
            </svg>
        </div>
    );
};

export default Spinner;