//! MCP Client Module - Extension System for Graviton IDE
//! 
//! Follows MCP best practices:
//! - Tool naming: graviton_extension_{action}
//! - Snake_case convention
//! - Actionable error messages

use serde::{Deserialize, Serialize};

/// Response from an extension invocation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExtensionResponse {
    pub success: bool,
    pub content: String,
    pub extension_name: String,
}

/// Request to an extension
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExtensionRequest {
    pub prompt: String,
    pub extension_id: String,
}

/// Extension trait defining the interface for all extensions
/// Following MCP pattern: tools should be focused and atomic
pub trait Extension: Send + Sync {
    /// Get the unique identifier for this extension
    fn get_id(&self) -> &str;
    
    /// Get the display name for this extension
    fn get_name(&self) -> &str;
    
    /// Send a prompt to the extension and get a response
    /// This is the core MCP-style tool: graviton_extension_invoke
    fn invoke(&self, request: &ExtensionRequest) -> ExtensionResponse;
}

/// Mock Extension for testing - echoes back the input
/// Implements the Extension trait with a simple echo behavior
pub struct MockExtension {
    id: String,
    name: String,
}

impl MockExtension {
    pub fn new() -> Self {
        Self {
            id: "mock_echo".to_string(),
            name: "Mock Echo Extension".to_string(),
        }
    }
}

impl Default for MockExtension {
    fn default() -> Self {
        Self::new()
    }
}

impl Extension for MockExtension {
    fn get_id(&self) -> &str {
        &self.id
    }
    
    fn get_name(&self) -> &str {
        &self.name
    }
    
    fn invoke(&self, request: &ExtensionRequest) -> ExtensionResponse {
        ExtensionResponse {
            success: true,
            content: format!("[Echo] {}", request.prompt),
            extension_name: self.name.clone(),
        }
    }
}

/// Extension Manager - handles loading and invoking extensions
pub struct ExtensionManager {
    extensions: Vec<Box<dyn Extension>>,
}

impl ExtensionManager {
    pub fn new() -> Self {
        Self {
            extensions: Vec::new(),
        }
    }
    
    /// Register a new extension
    pub fn register(&mut self, extension: Box<dyn Extension>) {
        self.extensions.push(extension);
    }
    
    /// Load default extensions (Mock for MVP)
    pub fn load_defaults(&mut self) {
        self.register(Box::new(MockExtension::new()));
    }
    
    /// Get list of available extensions
    pub fn list_extensions(&self) -> Vec<(&str, &str)> {
        self.extensions
            .iter()
            .map(|ext| (ext.get_id(), ext.get_name()))
            .collect()
    }
    
    /// Invoke an extension by ID
    /// MCP tool: graviton_extension_invoke
    pub fn invoke_extension(&self, request: &ExtensionRequest) -> Result<ExtensionResponse, String> {
        for ext in &self.extensions {
            if ext.get_id() == request.extension_id {
                return Ok(ext.invoke(request));
            }
        }
        
        // Actionable error message (MCP best practice)
        Err(format!(
            "Extension '{}' not found. Available extensions: {:?}. Try using 'mock_echo' for testing.",
            request.extension_id,
            self.list_extensions()
        ))
    }
}

impl Default for ExtensionManager {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_mock_extension_creation() {
        let ext = MockExtension::new();
        assert_eq!(ext.get_id(), "mock_echo");
        assert_eq!(ext.get_name(), "Mock Echo Extension");
    }

    #[test]
    fn test_mock_extension_invoke() {
        let ext = MockExtension::new();
        let request = ExtensionRequest {
            prompt: "Hello, Graviton!".to_string(),
            extension_id: "mock_echo".to_string(),
        };
        
        let response = ext.invoke(&request);
        
        assert!(response.success);
        assert_eq!(response.content, "[Echo] Hello, Graviton!");
        assert_eq!(response.extension_name, "Mock Echo Extension");
    }

    #[test]
    fn test_extension_manager_load() {
        let mut manager = ExtensionManager::new();
        manager.load_defaults();
        
        let extensions = manager.list_extensions();
        assert_eq!(extensions.len(), 1);
        assert_eq!(extensions[0].0, "mock_echo");
    }

    #[test]
    fn test_extension_manager_invoke() {
        let mut manager = ExtensionManager::new();
        manager.load_defaults();
        
        let request = ExtensionRequest {
            prompt: "Test prompt".to_string(),
            extension_id: "mock_echo".to_string(),
        };
        
        let result = manager.invoke_extension(&request);
        assert!(result.is_ok());
        
        let response = result.unwrap();
        assert!(response.success);
        assert!(response.content.contains("Test prompt"));
    }

    #[test]
    fn test_extension_not_found() {
        let manager = ExtensionManager::new();
        
        let request = ExtensionRequest {
            prompt: "Test".to_string(),
            extension_id: "nonexistent".to_string(),
        };
        
        let result = manager.invoke_extension(&request);
        assert!(result.is_err());
        assert!(result.unwrap_err().contains("not found"));
    }
}
