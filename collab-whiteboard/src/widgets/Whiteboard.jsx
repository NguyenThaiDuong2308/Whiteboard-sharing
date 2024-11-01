// src/widgets/Whiteboard.jsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import ToolBar from './ToolBar';
import { draw, drawPolyline, drawLine, drawRectangle, drawCircle } from '../utils/DrawingUtils';
import '../widgets_css/Whiteboard.css';
import { WebSocketContext } from '../WebSocketContext';

function Whiteboard() {
    const canvasRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(2);
    const [lastPos, setLastPos] = useState(null);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [tool, setTool] = useState('polyline');
    const [showEraserCursor, setShowEraserCursor] = useState(false);//activate button erase 
    const [eraserPosition, setEraserPosition] = useState({ x: 0, y: 0 });//erase position 
    const [eraserSize, setEraserSize] = useState(lineWidth * 5);

    // Lấy `message` và `sendMessage` từ WebSocketContext
    const { message, sendMessage } = useContext(WebSocketContext);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Kiểm tra nếu có tin nhắn mới
        if (!message) return;

        // Chuyển đổi dữ liệu nếu cần
        const parseMessage = JSON.parse(message)
        console.log(parseMessage.tag)
        console.log(parseMessage.data)
        // Xử lý các tin nhắn khác nhau dựa vào tag
        if (parseMessage.tag === 'drawing') {
            draw(context, parseMessage.data.x0, parseMessage.data.y0, parseMessage.data.x1, parseMessage.data.y1, parseMessage.data.color, parseMessage.data.lineWidth); // Gọi hàm `draw` để vẽ
        } else if (parseMessage.tag === 'history') {
            // Get and recreate whiteboard

            // Lặp qua danh sách shapes và vẽ từng shape lên canvas
            parseMessage.data.forEach((drawData) => {
                draw(
                    context,
                    drawData.x0,
                    drawData.y0,
                    drawData.x1,
                    drawData.y1,
                    drawData.color,
                    drawData.lineWidth
                )
            });
        } else if (parseMessage.tag === 'clearCanvas') {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, [message]);
    
    const onDrawingEvent = (shape) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (tool === 'polyline') {
            draw(context, shape.x0, shape.y0, shape.x1, shape.y1, shape.color, shape.lineWidth);
        } else if (shape.tool === 'line') {
            //TODO: drawLine(context, shape.x0, shape.y0, shape.x1, shape.y1, shape.color, shape.lineWidth);
        } else if (shape.tool === 'rectangle') {
            //TODO: drawRectangle(context, shape.x0, shape.y0, shape.x1, shape.y1, shape.color, shape.lineWidth);
        } else if (shape.tool === 'circle') {
            //TODO: drawCircle(context, shape.x0, shape.y0, shape.x1, shape.y1, shape.color, shape.lineWidth);
        }
        console.log(tool);

    };

    const startDrawing = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.beginPath();
        setStartPos({ x, y });
        setLastPos({ x, y });
        setIsDrawing(true);
        setLastPos(null);
    };

    const stopDrawing = (e) => {
        if (!isDrawing) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const context = canvasRef.current.getContext('2d');

        if (tool === 'line') {
            drawLine(context, startPos.x, startPos.y, x, y, color, lineWidth);
        } else if (tool === 'rectangle') {
            drawRectangle(context, startPos.x, startPos.y, x, y, color, lineWidth);
        } else if (tool === 'circle') {
            drawCircle(context, startPos.x, startPos.y, x, y, color, lineWidth);
        }
        setIsDrawing(false);
        // sendMessage('drawing', {
        //     x0: startPos.x,
        //     y0: startPos.y,
        //     x1: x,
        //     y1: y,
        //     color: tool === 'eraser' ? '#FFFFFF' : color,
        //     lineWidth: tool === 'eraser' ? lineWidth * 5 : lineWidth,
        //     tool: tool
        // });
        //  setLastPos(null);
    };

    const activateEraser = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setTool('eraser');
        setShowEraserCursor(true);
        setEraserPosition({ x, y });
    };

    const handleMouseMove = (e) => {

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (tool === 'eraser') {
            setEraserPosition({ x, y });
            // Nếu không nhấn chuột thì chỉ di chuyển cục tẩy
        }
        if (!isDrawing) {
            return;
        }
        const previewCanvas = previewCanvasRef.current;
        const previewContext = previewCanvas.getContext('2d');
        previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        if (tool === 'polyline') {
            drawPolyline(e, canvasRef, isDrawing, color, lineWidth, sendMessage, lastPos, setLastPos);
            sendMessage('drawing', {
                x0: lastPos?.x || x,
                y0: lastPos?.y || y,
                x1: x,
                y1: y,
                color: tool === 'eraser' ? '#FFFFFF' : color,
                lineWidth: tool === 'eraser' ? lineWidth * 5 : lineWidth,
                tool: tool
            });

        } else if (tool === 'line') {
            drawLine(previewContext, startPos.x, startPos.y, x, y, color, lineWidth);

            //	drawLine(context, startPos.x, startPos.y, x, y, color, lineWidth);
        } else if (tool === 'rectangle') {
            drawRectangle(previewContext, startPos.x, startPos.y, x, y, color, lineWidth);

            //	drawRectangle(context, startPos.x, startPos.y, x, y, color, lineWidth);
        } else if (tool === 'circle') {
            drawCircle(previewContext, startPos.x, startPos.y, x, y, color, lineWidth);
            //	drawCircle(context, startPos.x, startPos.y, x, y, color, lineWidth);
        }
        if (tool === 'eraser') {
            drawPolyline(e, canvasRef, isDrawing, '#FFFFFF', lineWidth * 10, sendMessage, lastPos, setLastPos);
            sendMessage('drawing', {
                x0: lastPos?.x || x,
                y0: lastPos?.y || y,
                x1: x,
                y1: y,
                color: tool === 'eraser' ? '#FFFFFF' : color,
                lineWidth: tool === 'eraser' ? lineWidth * 5 : lineWidth,
                tool: tool
            });
        }

        //  Gửi dữ liệu vẽ tới server qua WebSocket


        setLastPos({ x, y });
    };

    // Function to clear the preview canvas after mouse up
    const clearPreviewCanvas = () => {
        previewCanvasRef.current.getContext('2d')
            .clearRect(
                0, 0,
                previewCanvasRef.current.width,
                previewCanvasRef.current.height
            )
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Gửi yêu cầu xóa canvas tới server qua WebSocket
        sendMessage('clearCanvas', {});
    };

    return (
        <div
            className="whiteboard-container"
            style={{
                position: 'relative'
            }}
        >
            <ToolBar
                setColor={setColor}
                setLineWidth={(newLineWidth) => {
                    setLineWidth(newLineWidth);
                    setEraserSize(newLineWidth * 10); // Cập nhật kích thước nút xóa khi thay đổi lineWidth
                }}
                setTool={(selectedTool) => {
                    setTool(selectedTool);
                    setShowEraserCursor(selectedTool === 'eraser');
                }}
                clearCanvas={clearCanvas}
                activateEraser={activateEraser}
            />
            <canvas id="canvas" style={{
            }}
                ref={canvasRef}
                width={800}
                height={600}
                onMouseDown={(e) => {
                    if (e.button === 0) { // Only start drawing if LMB is pressed
                        startDrawing(e);
                    }
                }}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onMouseMove={handleMouseMove}
            />
            <canvas id="previewCanvas"
                ref={previewCanvasRef}
                style={{
                    position: 'absolute',
                    //! rect.getBoundingRect() did not init at app start, crash at room create (need review)
                    top: canvasRef.current?.getBoundingClientRect().top || 0,
                    opacity: canvasRef.current?.getBoundingClientRect().top ? '100%' : '0%',
                    border: 'none'
                }}
                width={800}
                height={600}
                onMouseDown={(e) => {
                    if (e.button === 0) { // Only start drawing if LMB is pressed
                        startDrawing(e);
                    }
                }}
                onMouseUp={(e) => {
                    stopDrawing(e)
                    clearPreviewCanvas()
                }}
                onMouseOut={stopDrawing}
                onMouseMove={handleMouseMove}
            />
            {showEraserCursor && (
                (() => {
                    const canvas = canvasRef.current;
                    const rect = canvas.getBoundingClientRect();
                    const left = eraserPosition.x - eraserSize / 2 + 0.65 * rect.left;
                    const top = eraserPosition.y - eraserSize / 2 + rect.top;
                    const width = eraserSize;
                    {/* console.log("Eraser Style:", { eraserPosition });
                    console.log("Eraser Style:", { left, top, width }); */}
                    return (
                        <div
                            className="eraser-cursor"
                            style={{
                                left: left,
                                top: top,
                                width: width,
                                height: width,
                                borderRadius: '50%',
                                position: 'absolute',
                                backgroundColor: '#cccccc60',
                                pointerEvents: 'none',
                            }}
                        />
                    );
                })()
            )}

        </div>
    );
}

export default Whiteboard;
