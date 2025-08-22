"""
配置管理模块
"""
import os
from typing import List
from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    """应用配置"""
    
    # AI服务配置
    openai_api_key: str = Field(default="", env="OPENAI_API_KEY")
    openai_model: str = Field(default="gpt-3.5-turbo", env="OPENAI_MODEL")
    embedding_model: str = Field(default="text-embedding-ada-002", env="EMBEDDING_MODEL")
    
    # 数据库配置
    database_url: str = Field(default="sqlite:///./port_management.db", env="DATABASE_URL")
    redis_url: str = Field(default="redis://localhost:6379/0", env="REDIS_URL")
    
    # 向量数据库配置
    chroma_persist_directory: str = Field(default="./chroma_db", env="CHROMA_PERSIST_DIRECTORY")
    chroma_collection_name: str = Field(default="port_materials", env="CHROMA_COLLECTION_NAME")
    
    # API配置
    api_host: str = Field(default="0.0.0.0", env="API_HOST")
    api_port: int = Field(default=8001, env="API_PORT")
    debug: bool = Field(default=True, env="DEBUG")
    cors_origins: List[str] = Field(
        default=["http://localhost:3000", "http://127.0.0.1:3000"], 
        env="CORS_ORIGINS"
    )
    
    # 日志配置
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    log_file: str = Field(default="./logs/ai_service.log", env="LOG_FILE")
    
    # 安全配置
    secret_key: str = Field(default="your_secret_key_here", env="SECRET_KEY")
    access_token_expire_minutes: int = Field(default=30, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    
    # 模拟数据配置
    use_mock_data: bool = Field(default=True, env="USE_MOCK_DATA")
    mock_data_size: int = Field(default=1000, env="MOCK_DATA_SIZE")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# 全局配置实例
settings = Settings()


def get_settings() -> Settings:
    """获取配置实例"""
    return settings
