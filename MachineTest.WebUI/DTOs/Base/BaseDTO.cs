namespace HRIS.InventoryManager.DTOs.Base
{
    public class BaseDTO<T>
    {
        public bool succeeded { get; set; }
        public string message { get; set; }
        public object errors { get; set; }
        public T data { get; set; }
    }


}
