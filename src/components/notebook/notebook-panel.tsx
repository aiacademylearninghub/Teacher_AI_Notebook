"use client"

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ToolDashboard } from './tool-dashboard';
import { LocalStoryTool } from './tools/local-story-tool';
import { WorksheetWizardTool } from './tools/worksheet-wizard-tool';
import { SimpleExplainerTool } from './tools/simple-explainer-tool';
import { LessonPlannerTool } from './tools/lesson-planner-tool';
import { GameTimeTool } from './tools/game-time-tool';

type Tool = 'story' | 'worksheet' | 'explainer' | 'planner' | 'game';

export function NotebookPanel() {
    const [activeTool, setActiveTool] = useState<Tool | null>(null);

    const renderTool = () => {
        if (!activeTool) {
            return (
                <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ToolDashboard onSelectTool={setActiveTool} />
                </motion.div>
            );
        }

        const commonProps = {
            onBack: () => setActiveTool(null),
        };

        let toolComponent;
        switch (activeTool) {
            case 'story':
                toolComponent = <LocalStoryTool {...commonProps} />;
                break;
            case 'worksheet':
                toolComponent = <WorksheetWizardTool {...commonProps} />;
                break;
            case 'explainer':
                toolComponent = <SimpleExplainerTool {...commonProps} />;
                break;
            case 'planner':
                toolComponent = <LessonPlannerTool {...commonProps} />;
                break;
            case 'game':
                toolComponent = <GameTimeTool {...commonProps} />;
                break;
            default:
                return null;
        }

        return (
            <motion.div key={activeTool} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                {toolComponent}
            </motion.div>
        );
    };

    return (
        <AnimatePresence mode="wait">
            {renderTool()}
        </AnimatePresence>
    );
}
