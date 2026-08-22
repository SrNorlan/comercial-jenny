const ProductoService = require('../services/ProductoService');

const ProductoController = 
{
    vistaProductos(req, res)
    { res.render('productos', { UserRol: req.user.Rol}); },

  async mostrarPorCategoria(req, res) 
  {
    const categoria = req.params.categoria;
    try 
    {
      const productos = await ProductoService.obtenerPorCategoria(categoria);
      res.render('showProducts', 
    {
        Producto: productos,
        Categoria: categoria,
        UserRol: req.user.Rol
      });
    } 
    catch (error) 
    {  console.error('Error al mostrar productos por categoría:', error); }
  },

  async editarProducto(req, res) 
  {
    const { Cat, IdProd } = req.params;
    try 
    {
      const producto = await ProductoService.buscarProducto(Cat, IdProd);
      const errorMessage = req.cookies.errorMessage;
      res.clearCookie('errorMessage');

      res.render('editProducts', 
        {
            Producto: producto,
            Mensaje: errorMessage,
            UserRol: req.user.Rol
        });
    } 
    catch (error) 
    { console.error('Error al editar producto:', error); }
  },

  async agregarProducto(req, res) 
  {
    const categoria = req.body.Categoria_Prod;

    try 
    {
      await ProductoService.agregar(req.body);
      res.render('productos', 
    {
        alert: true,
        alertTitle: 'Producto agregado',
        alertMessage: '¡Se agregó el producto correctamente!',
        alertIcon: 'success',
        showConfirmButton: true,
        timer: false,
        cat: categoria,
        UserRol: req.user.Rol
      });
    } 
    catch (error) 
    {
      console.error('Error al agregar producto:', error);
       res.render('productos',
        {
            alert: true,
            alertTitle: 'No se pudo completar la operación',
            alertMessage: 'No se pudo agregar el producto, compruebe los datos e intente nuevamente',
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            cat: categoria,
            UserRol: req.user.Rol
        });
    }
  },

  async actualizarProducto(req, res) 
  {
    const categoria = req.body.Categoria_Prod;

    try 
    {
        await ProductoService.actualizar(req.body);
        res.render('productos',
        {
            alert: true,
            alertTitle: 'Operación completada',
            alertMessage: 'Se editó el producto correctamente',
            alertIcon: 'success',
            showConfirmButton: true,
            timer: false,
            cat: categoria,
            UserRol: req.user.Rol
        });
    }
    catch (error) 
    {
        console.error('Error al actualizar producto:', error);
        res.render('productos',
        {
            alert: true,
            alertTitle: 'No se pudo completar la operación',
            alertMessage: 'No se pudo editar el producto, compruebe los datos e intente nuevamente',
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            cat: categoria,
            UserRol: req.user.Rol
        });
    }
  }
};

module.exports = ProductoController;
